# Setting up the database and admin panel

The website's text now lives in a Supabase database instead of in the code, images live in
Cloudinary, and there's a password-protected admin panel at **`/admin`** for editing all of
it.

Everything is written and wired up. All you have to do is create the two accounts and paste
their keys — about fifteen minutes.

---

## 1. Create the Supabase project

1. Sign up at [supabase.com](https://supabase.com) and create a new project.
2. Choose a region close to your visitors — Singapore or Mumbai are the nearest to Nepal.
3. Save the database password it gives you somewhere safe. You won't need it for this
   setup, but you'll want it later.

Wait for the project to finish provisioning (a minute or two).

## 2. Create the tables

1. In the Supabase dashboard open **SQL Editor** → **New query**.
2. Open `supabase/schema.sql` from this project, copy all of it, paste it in, and press
   **Run**.

That one file creates every table, locks them down, and fills them with the text that is
currently on the website — so nothing looks empty when you first sign in. It's safe to run
more than once and won't overwrite edits you've already made.

## 3. Add your keys

In the Supabase dashboard go to **Project Settings → API Keys** and copy two values:

- the **Project URL** (looks like `https://abcdefgh.supabase.co`)
- the **publishable** key, also labelled **anon public** (a long string)

Create a file called **`.env.local`** in the project root — the same folder as
`package.json` — containing:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-PUBLISHABLE-KEY
```

There's a template at `.env.local.example` you can copy.

There is deliberately no Supabase service-role key anywhere in this project: the admin
panel saves as whoever is signed in, and the database decides what that person is allowed
to change.

`.env.local` is already excluded from git, so your keys won't be committed.

## 4. Set up Cloudinary for images

1. Sign up at [cloudinary.com](https://cloudinary.com) — the free tier is generous and
   needs no card.
2. On the dashboard, find **API environment variable**. It's one line that looks like
   `cloudinary://123456789:abcDEF...@your-cloud-name`.
3. Add it to the same `.env.local` file:

```
CLOUDINARY_URL=cloudinary://YOUR-API-KEY:YOUR-API-SECRET@YOUR-CLOUD-NAME
```

That single line carries all three parts, so there's nothing to split up.

Note there's no `NEXT_PUBLIC_` on it. The secret stays on the server: when you upload,
the panel checks you're an administrator and then hands the browser a one-off signature
valid for that upload only. The file goes straight from your computer to Cloudinary
without passing through the website's server.

**This step is optional.** Skip it and everything else still works — you just won't be able
to upload from the panel, and will need to paste image links from elsewhere instead.

## 5. Create your admin account

In the Supabase dashboard go to **Authentication → Users → Add user → Create new user**.

- Enter the email address and password you want to sign in with.
- Tick **Auto Confirm User** so you can log in straight away.

**The first account created in the project automatically becomes the administrator.** No
ids to copy, nothing to configure.

## 6. Turn off public sign-ups

This one matters. By default a Supabase project lets anyone create an account.

Go to **Authentication → Sign In / Providers → Email** and turn **Allow new users to sign
up** off.

Nobody who signs up can edit anything — they aren't an administrator, so every save is
refused by the database and the panel tells them so. But turning sign-ups off means
strangers can't create accounts in your project at all, which is tidier.

## 7. Start it up

```bash
npm run dev
```

Open <http://localhost:3000/admin>, sign in with the account from step 5, and you're in.

---

## What you can edit

| Section | What it controls |
|---|---|
| **Blogs & articles** | Write, edit, publish, unpublish and delete articles. Published ones appear on `/blog` newest first; drafts stay invisible to visitors. |
| **Services** | The headings on `/services`, the three service cards and everything they list, the four picture cards on the home page, and the numbered "how it works" steps. |
| **Board & CEO** | Names, roles, photographs and biographies for the CEO and every board member, plus the order the directors appear in. |
| **Page headings** | Every heading and subheading across the whole site, grouped by page — plus the mission / vision / goal statements on both the home and about pages. |

Saving puts the change on the live site straight away. There's no separate publish step.

### Writing an article

The body is built from blocks — paragraph, heading, bullet list, pull quote — rather than
a rich text box. Add them in any order, drag the arrows to reorder, and the article page
lays them out correctly every time. Nothing you type can break the page layout.

The web address is generated from the title, but you can override it. Changing it on an
article that's already published will break any link people have shared.

Leave **reading time** blank and it's calculated from the length of the body.

### Images

Every image box works two ways: **Upload a file** sends the picture to Cloudinary, or you
can paste a link to an image hosted anywhere else. Both end up as an ordinary web address,
so you can mix the two freely.

Uploads are sorted into folders in your Cloudinary media library — `impulse/team`,
`impulse/blog`, `impulse/services` — so it stays navigable.

You don't need to resize anything before uploading. The site asks Cloudinary for each image
at the size that spot actually needs, and Cloudinary converts it to WebP or AVIF for
browsers that support them. One upload serves the full-size page, the thumbnail, and
everything in between. Photographs of people are cropped with face detection, so heads stay
in frame.

The limit is 10 MB per image, which is far above anything a website needs.

### Hiding something without deleting it

Every service card and every board member has a **Show on the website** tick box. Unticking
it removes the item from the public page but keeps it here, which is safer than deleting
when you might want it back.

---

## How the security works

Three layers, in increasing order of importance:

1. **`proxy.js`** sends anonymous visitors from `/admin/*` to the login screen.
2. **The panel layout** re-checks on the server that you're signed in *and* an
   administrator before rendering anything.
3. **Row level security in Postgres** is what actually protects the data. Every table
   allows the public to read published content only, and allows writes exclusively to
   accounts listed in the `admins` table. This is enforced by the database itself, so it
   holds regardless of what any request claims.

That's why there's no Supabase secret in the project. The Supabase key in `.env.local` is
the publishable one, designed to be visible in the browser — on its own it grants nothing
beyond reading content that is already public on the website.

The Cloudinary secret is different: it *is* a secret, and it stays on the server. Uploading
goes through the same admin check as every other change, and the browser only ever receives
a signature for the one upload it's making. Nobody who hasn't signed in can put files in
your Cloudinary account.

### Adding a second administrator

Create the user in **Authentication → Users**, then run this in the SQL editor:

```sql
insert into public.admins (user_id, email)
select id, email from auth.users where email = 'their@email.com';
```

### Removing one

```sql
delete from public.admins where email = 'their@email.com';
```

---

## Deploying

Add the same variables in your host's dashboard — on Vercel that's **Project Settings →
Environment Variables** — using the identical names:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `CLOUDINARY_URL`

Then redeploy. Nothing else changes.

---

## If something looks wrong

**The admin panel says "Almost there".**
`.env.local` is missing, misnamed, or the dev server wasn't restarted after it was
created. The file must sit next to `package.json` and be named exactly `.env.local`.

**"No sections found — has supabase/schema.sql been run?"**
Step 2 didn't complete. Re-run `supabase/schema.sql`; it's safe to run again.

**You can sign in but see "No editing access".**
That account isn't in the `admins` table — it wasn't the first one created. Use the SQL
under *Adding a second administrator* above.

**"Cloudinary is not configured" when uploading an image.**
`CLOUDINARY_URL` is missing from `.env.local`, or the dev server wasn't restarted after it
was added. In the meantime you can paste an image link into the same box.

**An upload is rejected by Cloudinary.**
The message is passed through verbatim, so it will say what's wrong. The usual causes are a
mistyped `CLOUDINARY_URL` and a file over 10 MB.

**An edit isn't showing on the website.**
Saves refresh the public pages immediately, so check first that the item is ticked **Show
on the website**, and that an article's status is *Published* rather than *Draft*.

**The website still shows the old wording everywhere.**
That's the built-in fallback copy in `lib/fallback.js`, which renders whenever the
database can't be reached — so an outage or a wrong key shows the site as it was rather
than a page of blank headings. Check the keys in `.env.local` against the Supabase
dashboard.
