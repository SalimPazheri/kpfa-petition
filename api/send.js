const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const SUBJECT =
  'Request for Urgent Government Intervention to Address Serious Challenges Faced by Broiler Poultry Farming Sector in Kerala';

const DISTRICTS = [
  { en: 'Thiruvananthapuram', ml: 'തിരുവനന്തപുരം' },
  { en: 'Kollam', ml: 'കൊല്ലം' },
  { en: 'Pathanamthitta', ml: 'പത്തനംതിട്ട' },
  { en: 'Alappuzha', ml: 'ആലപ്പുഴ' },
  { en: 'Kottayam', ml: 'കോട്ടയം' },
  { en: 'Idukki', ml: 'ഇടുക്കി' },
  { en: 'Ernakulam', ml: 'എറണാകുളം' },
  { en: 'Thrissur', ml: 'തൃശ്ശൂർ' },
  { en: 'Palakkad', ml: 'പാലക്കാട്' },
  { en: 'Malappuram', ml: 'മലപ്പുറം' },
  { en: 'Kozhikode', ml: 'കോഴിക്കോട്' },
  { en: 'Wayanad', ml: 'വയനാട്' },
  { en: 'Kannur', ml: 'കണ്ണൂർ' },
  { en: 'Kasaragod', ml: 'കാസർഗോഡ്' },
];

/* ---------------------------------------------------------------- letters */

const EN = {
  heading: 'English',
  fromLabel: 'From',
  fromLines: (s) => [
    s.name,
    s.address,
    `${s.district.en} District`,
    `Mobile: ${s.mobile}`,
    ...(s.email ? [`Email: ${s.email}`] : []),
  ],
  toLabel: 'To',
  to: [
    "The Hon'ble Chief Minister of Kerala",
    'Office of the Chief Minister',
    'North Block, Government Secretariat',
    'Thiruvananthapuram – 695001',
  ],
  subjectLabel: 'Subject',
  salutation: 'Respected Sir,',
  intro: [
    "Broiler poultry farming is one of the major agricultural allied sectors in Kerala, providing direct and indirect livelihood opportunities to tens of thousands of families and playing a significant role in ensuring the state's food security.",
    'However, due to certain impractical regulations, restrictive policies and excessive taxation, poultry farmers across the state are being pushed into severe financial difficulties and mounting debt. The continued existence of this sector and the livelihoods of thousands of farming families are now under serious threat.',
    'In this regard, the State Committee of the Kerala Poultry Farmers Association (KPFA) respectfully requests the Government to intervene urgently and take appropriate action on the following important issues to protect the broiler poultry farming sector and safeguard the interests of small and medium-scale poultry farmers.',
  ],
  points: [
    {
      title: 'Recognise Broiler Poultry Farming as an Agricultural Activity',
      paras: [
        'The Government should officially recognise broiler poultry farming as a full-fledged Agricultural Activity and issue the necessary Government Order in this regard.',
        'This recognition would enable poultry farmers to access benefits such as concessional agricultural electricity tariffs, low-interest agricultural loans, government subsidies and other financial assistance provided to the agricultural sector.',
      ],
    },
    {
      title: 'Exempt Poultry Farm Sheds from Labour Cess and One-Time Tax',
      paras: [
        'The construction of temporary poultry farm sheds for agricultural purposes currently attracts substantial financial burdens, including building taxes, One-Time Tax and Labour Cess imposed by local self-government institutions.',
        'These charges place an additional and unreasonable financial burden on poultry farmers, particularly small and medium-scale operators.',
        'Therefore, we request the Government to issue a special order granting complete exemption from such taxes and Labour Cess for poultry farm sheds constructed exclusively for agricultural purposes.',
      ],
    },
    {
      title: "Provide Relaxation from the Pollution Control Board's 500-Metre Distance Requirement",
      paras: [
        'The 500-metre distance restriction imposed by the Kerala State Pollution Control Board on poultry farms with more than 5,000 birds, requiring them to maintain a minimum distance from residential areas, is highly impractical in a densely populated state like Kerala.',
        "If this regulation is implemented strictly, a large number of existing poultry farms across the state may be forced to shut down. This would adversely affect poultry production, result in a sharp increase in chicken meat prices and lead to significant employment losses, severely impacting the state's poultry farming sector.",
        "Considering Kerala's unique geographical conditions and high population density, we request the Government to provide necessary relaxation from the 500-metre distance requirement for farms that strictly comply with scientific waste management systems, hygiene standards and environmental protection measures.",
        'Alternatively, the Government may formulate practical and scientifically appropriate alternative guidelines that take into account the specific geographical and demographic conditions of Kerala.',
      ],
    },
  ],
  conclusion: {
    title: 'Conclusion',
    paras: [
      "The above-mentioned issues are not merely individual concerns of poultry farmers. They are directly connected to Kerala's food security, employment protection, rural economy and the sustainability of the agricultural allied sector.",
      "Therefore, on behalf of the State Committee of the Kerala Poultry Farmers Association, we earnestly request the Hon'ble Chief Minister to understand the serious difficulties faced by thousands of broiler poultry farmers across Kerala and take immediate and favourable decisions on the above demands.",
      'We sincerely hope that the Government will take appropriate steps to protect the livelihoods of poultry farmers and prevent them from being pushed further into financial distress and debt.',
      'We look forward to your favourable consideration and urgent intervention.',
    ],
  },
  regards: 'Yours faithfully,',
  placeLabel: 'Place',
  place: (s) => s.district.en,
  dateLabel: 'Date',
  copyLabel: 'Copy to',
  copy: [
    "The Hon'ble Minister for Animal Husbandry and Dairy Development, Government of Kerala.",
    "The Hon'ble Minister for Local Self-Government, Government of Kerala.",
  ],
  subject: SUBJECT,
};

const ML = {
  heading: 'മലയാളം',
  fromLabel: 'പ്രേഷിതൻ',
  fromLines: (s) => [
    s.name,
    s.address,
    `${s.district.ml} ജില്ല`,
    `മൊബൈൽ: ${s.mobile}`,
    ...(s.email ? [`ഇമെയിൽ: ${s.email}`] : []),
  ],
  toLabel: 'സ്വീകർത്താവ്',
  to: [
    'ബഹു. കേരള മുഖ്യമന്ത്രി,',
    'മുഖ്യമന്ത്രിയുടെ ഓഫീസ്,',
    'നോർത്ത് ബ്ലോക്ക്, ഗവൺമെന്റ് സെക്രട്ടേറിയറ്റ്,',
    'തിരുവനന്തപുരം - 695001.',
  ],
  subjectLabel: 'വിഷയം',
  subject:
    'ബ്രോയിലർ കോഴി വളർത്തൽ മേഖല നേരിടുന്ന ഗുരുതരമായ പ്രതിസന്ധികൾ പരിഹരിക്കുന്നതിനും കർഷകരെ സംരക്ഷിക്കുന്നതിനും അടിയന്തര നടപടി സ്വീകരിക്കുന്നത് സംബന്ധിച്ച്.',
  salutation: 'ബഹുമാനപ്പെട്ട സർ,',
  intro: [
    'കേരളത്തിലെ കാർഷിക-അനുബന്ധ മേഖലയിൽ പതിനായിരക്കണക്കിന് കുടുംബങ്ങൾക്ക് നേരിട്ടും അല്ലാതെയും ഉപജീവനമാർഗ്ഗം നൽകുന്നതും, സംസ്ഥാനത്തിന്റെ ഭക്ഷ്യസുരക്ഷയിൽ നിർണ്ണായക പങ്ക് വഹിക്കുന്നതുമായ ഒരു പ്രധാന മേഖലയാണ് ബ്രോയിലർ കോഴി വളർത്തൽ. എന്നാൽ, നിലവിലെ ചില അശാസ്ത്രീയമായ നിയമങ്ങളും അമിതമായ നികുതി വ്യവസ്ഥകളും കാരണം സംസ്ഥാനത്തെ കോഴി കർഷകർ കടുത്ത സാമ്പത്തിക പ്രതിസന്ധിയിലേക്കും കടക്കെണിയിലേക്കും തള്ളിവിടപ്പെടുകയാണ്.',
    'ഈ മേഖലയെ സംരക്ഷിക്കുന്നതിനായി താഴെ പറയുന്ന വിഷയങ്ങളിൽ അടിയന്തരമായി സർക്കാരിന്റെ ഇടപെടൽ ഉണ്ടാകണമെന്ന് കേരള പോൾട്രി ഫാർമേഴ്സ് അസോസിയേഷൻ സംസ്ഥാന കമ്മിറ്റി വിനീതമായി അഭ്യർത്ഥിക്കുന്നു:',
  ],
  points: [
    {
      title: 'കാർഷിക മേഖലയിൽ ഉൾപ്പെടുത്തുക',
      paras: [
        'ബ്രോയിലർ കോഴി വളർത്തലിനെ പൂർണ്ണമായും കാർഷിക പ്രവർത്തനമായി (Agricultural Activity) അംഗീകരിച്ച് ഉത്തരവ് പുറപ്പെടുവിക്കുക. ഇതിലൂടെ കർഷകർക്ക് ലഭിക്കേണ്ട കാർഷിക വൈദ്യുതി നിരക്ക് ഇളവുകൾ, കുറഞ്ഞ പലിശ നിരക്കിലുള്ള കാർഷിക വായ്പകൾ, മറ്റ് സർക്കാർ സബ്സിഡികൾ എന്നിവ ലഭ്യമാക്കുക.',
      ],
    },
    {
      title: 'ലേബർ സെസ്, വൺ ടൈം ടാക്സ് എന്നിവ ഒഴിവാക്കുക',
      paras: [
        'താൽക്കാലിക സ്വഭാവമുള്ള കോഴി ഫാം ഷെഡുകൾ നിർമ്മിക്കുമ്പോൾ തദ്ദേശ സ്വയംഭരണ സ്ഥാപനങ്ങൾ ഈടാക്കുന്ന അമിതമായ കെട്ടിട നികുതി, ഒറ്റത്തവണ നികുതി (One-Time Tax), ലേബർ സെസ് (Labour Cess) എന്നിവ കർഷകർക്ക് വലിയ സാമ്പത്തിക ബാധ്യതയാണ് ഉണ്ടാക്കുന്നത്. കാർഷിക ആവശ്യത്തിനായി നിർമ്മിക്കുന്ന ഇത്തരം ഷെഡുകളെ ഈ നികുതികളിൽ നിന്നും പൂർണ്ണമായും ഒഴിവാക്കി നൽകുക.',
      ],
    },
    {
      title: 'മലിനീകരണ നിയന്ത്രണ ബോർഡിന്റെ 500 മീറ്റർ ദൂരപരിധി നിബന്ധന ഒഴിവാക്കുക',
      paras: [
        '5000-ന് മുകളിൽ കോഴികളുള്ള ഫാമുകൾക്ക് ജനവാസ കേന്ദ്രങ്ങളിൽ നിന്നും 500 മീറ്റർ ദൂരപരിധി നിർബന്ധമാക്കിയ സംസ്ഥാന മലിനീകരണ നിയന്ത്രണ ബോർഡിന്റെ പുതിയ നിബന്ധന കേരളം പോലെ ജനസാന്ദ്രതയേറിയ ഒരു സംസ്ഥാനത്ത് ഒട്ടും പ്രായോഗികമല്ല. ഈ നിബന്ധന നടപ്പിലാക്കിയാൽ സംസ്ഥാനത്തെ ഭൂരിഭാഗം ഫാമുകളും അടച്ചുപൂട്ടേണ്ടി വരികയും, അത് കോഴിയിറച്ചി വില കുതിച്ചുയരുന്നതിനും തൊഴിൽ നഷ്ടത്തിനും കാരണമാവുകയും ചെയ്യും. ആയതിനാൽ, ശാസ്ത്രീയമായ മാലിന്യ സംസ്കരണവും ശുചിത്വവും ഉറപ്പുവരുത്തുന്ന ഫാമുകൾക്ക് ഈ 500 മീറ്റർ ദൂരപരിധി നിബന്ധനയിൽ അടിയന്തരമായി ഇളവ് അനുവദിക്കുക.',
      ],
    },
  ],
  conclusion: {
    title: null,
    paras: [
      'മേൽപ്പറഞ്ഞ വിഷയങ്ങൾ അനുഭാവപൂർവ്വം പരിഗണിച്ച്, കേരളത്തിലെ ബ്രോയിലർ കോഴി കർഷകരെ ആത്മഹത്യയിൽ നിന്നും കടക്കെണിയിൽ നിന്നും രക്ഷിക്കുന്നതിനാവശ്യമായ അടിയന്തര തീരുമാനങ്ങൾ കൈക്കൊള്ളണമെന്ന് വിനീതമായി അഭ്യർത്ഥിക്കുന്നു.',
    ],
  },
  regards: 'വിശ്വസ്തതയോടെ,',
  placeLabel: 'സ്ഥലം',
  place: (s) => s.district.ml,
  dateLabel: 'തീയതി',
  copyLabel: 'പകർപ്പ്',
  copy: [
    'ബഹു. മൃഗസംരക്ഷണ-ക്ഷീരവികസന വകുപ്പ് മന്ത്രി, കേരള സർക്കാർ.',
    'ബഹു. തദ്ദേശ സ്വയംഭരണ വകുപ്പ് മന്ത്രി, കേരള സർക്കാർ.',
  ],
};

/* ---------------------------------------------------------------- helpers */

const esc = (v) =>
  String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const oneLine = (v, max) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max);

const multiLine = (v, max) =>
  String(v ?? '')
    .split(/\r?\n/)
    .map((x) => x.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join(', ')
    .slice(0, max);

function toText(L, s) {
  const o = [];
  o.push(`${L.fromLabel}:`, ...L.fromLines(s), '');
  o.push(`${L.toLabel}:`, ...L.to, '');
  o.push(`${L.subjectLabel}: ${L.subject}`, '');
  o.push(L.salutation, '');
  L.intro.forEach((p) => o.push(p, ''));
  L.points.forEach((pt, i) => {
    o.push(`${i + 1}. ${pt.title}`);
    pt.paras.forEach((p) => o.push(p, ''));
  });
  if (L.conclusion.title) o.push(L.conclusion.title);
  L.conclusion.paras.forEach((p) => o.push(p, ''));
  o.push(L.regards, s.name, `${s.mobile}`, ...(s.email ? [s.email] : []), '');
  o.push(`${L.placeLabel}: ${L.place(s)}`, `${L.dateLabel}: ${s.date}`, '');
  o.push(`${L.copyLabel}:`, ...L.copy.map((c) => `- ${c}`));
  return o.join('\n');
}

function toHtml(L, s) {
  const lines = (arr) => arr.map(esc).join('<br>');
  const paras = (arr) => arr.map((p) => `<p style="margin:0 0 12px">${esc(p)}</p>`).join('');
  const points = L.points
    .map(
      (pt, i) =>
        `<p style="margin:16px 0 6px"><b>${i + 1}. ${esc(pt.title)}</b></p>${paras(pt.paras)}`
    )
    .join('');
  const concTitle = L.conclusion.title
    ? `<p style="margin:16px 0 6px"><b>${esc(L.conclusion.title)}</b></p>`
    : '';
  return `
<div style="font-family:'Noto Sans Malayalam','Segoe UI',Arial,sans-serif;font-size:15px;line-height:1.6;color:#222">
  <p style="margin:0 0 12px"><b>${esc(L.fromLabel)}:</b><br>${lines(L.fromLines(s))}</p>
  <p style="margin:0 0 12px"><b>${esc(L.toLabel)}:</b><br>${lines(L.to)}</p>
  <p style="margin:0 0 12px"><b>${esc(L.subjectLabel)}:</b> ${esc(L.subject)}</p>
  <p style="margin:0 0 12px">${esc(L.salutation)}</p>
  ${paras(L.intro)}
  ${points}
  ${concTitle}
  ${paras(L.conclusion.paras)}
  <p style="margin:16px 0 4px">${esc(L.regards)}</p>
  <p style="margin:0 0 12px"><b>${esc(s.name)}</b><br>${esc(s.mobile)}${s.email ? '<br>' + esc(s.email) : ''}</p>
  <p style="margin:0 0 12px">${esc(L.placeLabel)}: ${esc(L.place(s))}<br>${esc(L.dateLabel)}: ${esc(s.date)}</p>
  <p style="margin:0"><b>${esc(L.copyLabel)}:</b><br>${L.copy.map((c) => '• ' + esc(c)).join('<br>')}</p>
</div>`;
}

/* ---------------------------------------------------------------- handler */

const list = (v) => String(v || '').split(',').map((x) => x.trim()).filter(Boolean);

function getRecipients() {
  // TEST_TO overrides everything so local tests never reach the real offices
  if (process.env.TEST_TO) return { to: list(process.env.TEST_TO), cc: [] };
  return {
    to: list(process.env.MAIL_TO || 'chiefminister@kerala.gov.in'),
    cc: list(
      process.env.MAIL_CC || 'cmokerala@kerala.gov.in,min.ahd@kerala.gov.in,min.lsgd@kerala.gov.in'
    ),
  };
}

// Verified email via Google Sign-In if GOOGLE_CLIENT_ID is set, else an optional typed email
async function resolveEmail(body) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (clientId) {
    if (!body.credential) return { email: '' };
    try {
      const r = await fetch(
        'https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(String(body.credential))
      );
      const t = await r.json();
      if (!r.ok || t.aud !== clientId || String(t.email_verified) !== 'true' || !t.email) throw new Error('bad token');
      return { email: oneLine(t.email, 120) };
    } catch (e) {
      return { error: 'Google sign-in could not be verified. Please sign in again.' };
    }
  }
  const e = oneLine(body.email, 120);
  if (!e) return { email: '' };
  if (!/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(e)) return { error: 'Please enter a valid email address.' };
  return { email: e };
}

function writeOutbox(info, text, html) {
  try {
    const dir = path.join(process.cwd(), 'outbox');
    fs.mkdirSync(dir, { recursive: true });
    const head =
      '<div style="font-family:system-ui,sans-serif;background:#fff8e1;border:1px solid #e0c200;padding:10px 14px;margin:0 0 20px;font-size:14px">' +
      '<b>DRY RUN – not sent</b><br>' +
      `From: ${esc(info.from)}<br>To: ${esc(info.to)}<br>CC: ${esc(info.cc)}<br>Reply-To: ${esc(info.replyTo || '—')}<br>Subject: ${esc(info.subject)}</div>`;
    fs.writeFileSync(
      path.join(dir, 'last-email.html'),
      `<!DOCTYPE html><html lang="ml"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Dry run</title></head><body style="max-width:760px;margin:20px auto;padding:0 16px">${head}${html}</body></html>`,
      'utf8'
    );
    fs.writeFileSync(
      path.join(dir, 'last-email.txt'),
      `From: ${info.from}\nTo: ${info.to}\nCC: ${info.cc}\nReply-To: ${info.replyTo || '-'}\nSubject: ${info.subject}\n\n${text}`,
      'utf8'
    );
    return dir;
  } catch (e) {
    return null;
  }
}

const lastSeen = new Map(); // best-effort cooldown per mobile (per warm instance)
const COOLDOWN_MS = 60 * 1000;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};

    // Honeypot: bots fill this hidden field, humans never see it
    if (body.website) return res.status(200).json({ ok: true });

    const name = oneLine(body.name, 80);
    const address = multiLine(body.address, 250);
    const district = DISTRICTS.find((d) => d.en === body.district);
    const mobile = oneLine(body.mobile, 20).replace(/[\s-]/g, '').replace(/^(\+91|91|0)(?=\d{10}$)/, '');

    if (name.length < 2) return res.status(400).json({ ok: false, error: 'Please enter your name.' });
    if (address.length < 5) return res.status(400).json({ ok: false, error: 'Please enter your address.' });
    if (!district) return res.status(400).json({ ok: false, error: 'Please select your district.' });
    if (!/^[6-9]\d{9}$/.test(mobile))
      return res.status(400).json({ ok: false, error: 'Please enter a valid 10-digit mobile number.' });

    const em = await resolveEmail(body);
    if (em.error) return res.status(400).json({ ok: false, error: em.error });
    if (process.env.REQUIRE_EMAIL === '1' && !em.email) {
      return res.status(400).json({
        ok: false,
        error: process.env.GOOGLE_CLIENT_ID ? 'Please sign in with Google to continue.' : 'Please enter your email address.',
      });
    }

    const now = Date.now();
    if (now - (lastSeen.get(mobile) || 0) < COOLDOWN_MS) {
      return res.status(429).json({ ok: false, error: 'Already sent. Please wait a minute before trying again.' });
    }

    const { to, cc } = getRecipients();
    if (!to.length) throw new Error('No recipients configured');

    const s = {
      name,
      address,
      district,
      mobile: `+91 ${mobile}`,
      email: em.email,
      date: new Date().toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata' }), // dd/mm/yyyy
    };

    const text = `${toText(EN, s)}\n\n${'='.repeat(40)}\n\n${toText(ML, s)}`;
    const html = `${toHtml(EN, s)}<hr style="margin:28px 0;border:0;border-top:1px solid #ccc">${toHtml(ML, s)}`;

    const fromAddress = process.env.MAIL_FROM_ADDRESS || process.env.SMTP_USER;
    const fromName = `${name} (KPFA Petition)`;

    if (process.env.DRY_RUN === '1') {
      const dir = writeOutbox(
        {
          from: `${fromName} <${fromAddress || 'SMTP_USER'}>`,
          to: to.join(', '),
          cc: cc.join(', ') || '—',
          replyTo: em.email,
          subject: SUBJECT,
        },
        text,
        html
      );
      console.log('--- DRY RUN (nothing sent) ---');
      console.log('To:', to.join(', '), '| CC:', cc.join(', ') || '-', '| Reply-To:', em.email || '-');
      if (dir) console.log('Open to review: http://localhost:' + (process.env.PORT || 3000) + '/outbox/last-email.html');
      lastSeen.set(mobile, now);
      return res.status(200).json({ ok: true, dryRun: true });
    }

    const port = Number(process.env.SMTP_PORT || 465);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: { name: fromName, address: fromAddress },
      replyTo: em.email || undefined,
      to,
      cc: cc.length ? cc : undefined,
      subject: SUBJECT,
      text,
      html,
    });

    lastSeen.set(mobile, now);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('send failed:', err);
    return res.status(500).json({ ok: false, error: 'Could not send right now. Please try again later.' });
  }
};
