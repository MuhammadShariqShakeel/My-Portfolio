const RECIPIENT = 'shariqofficial6@gmail.com';
const DEFAULT_FROM = 'Portfolio Contact <onboarding@resend.dev>';

function getText(value) {
  return String(value ?? '').trim();
}

export async function handleContact(input = {}) {
  const name = getText(input.name);
  const email = getText(input.email);
  const subject = getText(input.subject);
  const message = getText(input.message);

  if (!name || !email || !subject || !message) {
    return { status: 400, body: { error: 'Please complete all fields.' } };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: 400, body: { error: 'Please enter a valid email address.' } };
  }

  const apiKey = getText(process.env.RESEND_API_KEY);
  console.log('RESEND_API_KEY exists:', Boolean(apiKey));
  if (!apiKey || apiKey === 'MY_RESEND_KEY') {
    return { status: 503, body: { error: 'Resend is not configured. Replace MY_RESEND_KEY in the root .env with a valid Resend API key, then restart npm run dev.' } };
  }

  try {
    const resend = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: DEFAULT_FROM,
        to: [RECIPIENT],
        reply_to: email,
        subject,
        text: 'Name: ' + name + '\nEmail: ' + email + '\n\n' + message,
      }),
    });

    const responseText = await resend.text();
    console.log('Resend HTTP status:', resend.status);
    if (!resend.ok) {
      let providerMessage = '';
      try {
        const parsed = JSON.parse(responseText);
        providerMessage = getText(parsed.message || parsed.error || parsed.name);
      } catch {
        providerMessage = getText(responseText);
      }
      console.error('Resend response error message:', providerMessage || 'No error message returned.');
      return {
        status: 502,
        body: { error: providerMessage || 'Resend rejected the request without an error message.' },
      };
    }

    return { status: 200, body: { sent: true } };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown network error.';
    console.error('Resend response error message:', errorMessage);
    return { status: 502, body: { error: 'Could not connect to Resend: ' + errorMessage } };
  }
}
