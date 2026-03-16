# stuypulse-rulebot

rules.json generated using this code
```
(async () => {
    let base = "https://www.frcmanual.com/2026/"
    let slugs = [
        "game-rules-(g)",
        "robot-construction-rules-(r)",
        "inspection-and-eligibility-(i)",
        "tournaments-(t)",
        "first-championship-tournament-(c)",
        "event-rules-(e)",
    ]

    let rules = {}

    for (let slug of slugs) {
        let html = await fetch(base + slug).then(r => r.text())
        let clean = html.replace(/<div[^>]*>/g, "").replace(/<\/div>/g, "").replace(/<!---->/g, "")
        let doc = new DOMParser().parseFromString(clean, "text/html")

        doc.querySelectorAll("h3[id]").forEach(h3 => {
            let match = h3.id.match(/^([a-z]\d+)-/)
            if (!match) return
            let key = match[1].toUpperCase()
            let name = h3.textContent.replace(/\s+/g, " ").trim().replace(/^[A-Za-z]\d+\s*\*?\s*/, "")
            let desc = h3.nextElementSibling.textContent.replace(/\s+/g, " ").trim()
            rules[key] = { name, desc, link: base + slug + "#" + h3.id }
        })

        console.log(slug + " done")
    }

    let json = JSON.stringify(rules)
    console.log(json)
})()
```
