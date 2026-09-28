# SkillBridge

A student prototype that answers one question: **what should I learn next to get hired?**

It compares a student's skills with what internships and graduate roles ask for, shows the gap, ranks what to learn first, and matches roles to the skills the student already has. There are also small college and recruiter views to show the same data from the other side.

**Live demo:** enable GitHub Pages (see below) and it will be at `https://<your-username>.github.io/skillbridge/`

## Try it

No install and no build step.

```bash
git clone https://github.com/<your-username>/skillbridge.git
cd skillbridge
python3 -m http.server 8000   # or just open index.html
```

## How it works

- **Quick check** scores five questions and blends the result with the student's starting level.
- **Priority** for each skill is 60% gap size plus 40% employer demand. The maths lives in `ranked()` in `js/app.js`.
- **Role match** is how much of a role's required skills you already cover, scaled to 40–100%.
- Finishing a module raises the skill level, so the plan re-orders.
- Progress is saved in your browser (`localStorage`). Clear site data to reset.

## Honest limits

This is a prototype. The skills, roles and college numbers in `js/data.js` are made-up demo data, and the "AI" is a transparent scoring rule, not a trained model. There is no backend or login.

## Ideas for next steps

- Real job data from an API, and skill extraction from listings
- A longer question bank per skill, with adaptive difficulty
- Accounts and a small backend so colleges see real batches
- Mentor matching

## Publish on GitHub Pages

```bash
git init && git add . && git commit -m "First version of SkillBridge"
git branch -M main
git remote add origin https://github.com/<your-username>/skillbridge.git
git push -u origin main
```

Then on GitHub go to **Settings → Pages → Source: GitHub Actions**. The workflow in `.github/workflows/pages.yml` deploys on every push.

## Structure

```
index.html        page shell
css/styles.css    all styling, light and dark
js/data.js        demo skills, quiz, courses, roles
js/app.js         state, scoring, pages, routing
```

MIT licensed.
