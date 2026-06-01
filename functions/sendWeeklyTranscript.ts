import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import SendGrid from 'npm:@sendgrid/mail@8.1.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const subject = body.subject || 'Weekly Transcript from Aesop';
    const text = body.text || '(No transcript content provided)';

    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
    if (!SENDGRID_API_KEY) {
      return Response.json({ error: 'Missing SendGrid API Key' }, { status: 500 });
    }

    SendGrid.setApiKey(SENDGRID_API_KEY);

    const msg = {
      to: 'wandermike@gmail.com',
      from: 'wandermike@gmail.com',
      subject: subject,
      text: text,
    };

    await SendGrid.send(msg);

    return Response.json({ ok: true, message: 'Email sent successfully' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
