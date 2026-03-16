import rules from "../rules.json" assert { type: "json" }

export default async function handler(req, res) {
    let body = req.body
    if (body.type === "url_verification") return res.json({ challenge: body.challenge })
    if (body.type !== "event_callback") return res.status(400).end()
    if (body.event.type !== "app_mention") return res.status(200).end()
        
    let matches = body.event.text.toUpperCase().match(/[A-Z]\d+/g) || []
    let lines = matches.filter(key => rules[key]).map(key => `<${rules[key].link}|${key}>: ${rules[key].name}`)

    await fetch("https://slack.com/api/chat.postMessage", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + process.env.SLACK_BOT_TOKEN
        },
        body: JSON.stringify({
            channel: body.event.channel,
            thread_ts: body.event.ts,
            text: lines.length ? lines.join("\n") : "No rules matched.",
        })
    })
    return res.status(200).end()
}