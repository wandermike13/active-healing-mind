import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const { 
      user_id,
      session_number,
      pain_before,
      pain_after,
      injury_area,
      binaural_beat_used,
      notes
    } = await req.json();

    if (!user_id || pain_before === undefined || pain_after === undefined) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const session_date = new Date().toISOString().split("T")[0];

    // Save session record
    const session = await base44.entities.Session.create({
      user_id,
      session_date,
      session_number: session_number || 1,
      pain_before,
      pain_after,
      injury_area: injury_area || "General",
      binaural_beat_used: binaural_beat_used || "healing_delta_2hz",
      completed: true,
      notes: notes || ""
    });

    // Log a pain tracking entry for the post-session pain level
    await base44.entities.PainTracking.create({
      user_id,
      log_date: session_date,
      pain_level: pain_after,
      injury_area: injury_area || "General",
      notes: `Post-session log (Session #${session_number})`
    });

    return Response.json({ 
      success: true, 
      session_id: session.id,
      pain_improvement: pain_before - pain_after
    });

  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
});
