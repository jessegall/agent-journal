# Sharing: setup

The configured journal owner can share a published record through a public link. A visitor with the link reads that
record, the linked records the owner approved and its comments, until the share is revoked or expires. Agents may only
propose a share; they never receive a link.

See also [providers.md](providers.md) for making records shareable and [gateways.md](gateways.md) for gateways.

## The share listener

Public links are served by a separate, share-only application, `bootstrap/sharing.php`. It loads the same Core and
domains but answers only the routes of `routes/sharing.php`:

- `GET` and `HEAD` `/s/{token}/{path}`: one shared page, read by `App\Http\Controllers\Sharing\ReadShareController`.
- `/build-sharing/{file}`: a file of the reader's own build, only when its manifest lists it.
- `/_probe/{challenge}`: the single-use answer a gateway's health probe expects.

Every other path, the sign-in page and the main application's assets included, answers 404. There is no session,
cookie, sign-in, Inertia or CSRF on this listener. Every answer carries `Cache-Control: no-store`,
`Referrer-Policy: no-referrer`, a strict `Content-Security-Policy`, `X-Frame-Options: DENY` and
`X-Robots-Tag: noindex, nofollow, noarchive`. Every failure shows a fixed page that never names the link, the token or
the cause, even with `APP_DEBUG` on.

The process runs the share listener when it starts with `JOURNAL_LISTENER=sharing`; no request header can switch to
it. Its address comes from `config/journal.php (sharing)`: `listener.host` is always `127.0.0.1`, and `listener.port` comes from
`SHARING_LISTENER_PORT`. Run it with static file serving off, so `public/` is reached only through these routes. The
public reader's stylesheet is built apart from the main application with `npm run build:sharing`.

Rate limits are counted in the cache store named by `sharing.rate_limit_store`, Redis by default: 120 reads a minute
of one share, and 600 a minute of links that lead nowhere. A valid link is never held back by invalid ones.

## Gateways

A gateway makes the listener reachable on a fixed public origin. Core brings two, registered as `tunler` and `ngrok`.

**Tunler** needs:

- the pinned program at `sharing.tunler.binary` (`SHARING_TUNLER_BINARY`);
- the journal's own configuration folder at `sharing.tunler.config_dir`, never a user's home, in which the journal is
  logged in to Tunler;
- the subdomain at `sharing.tunler.subdomain` (`SHARING_TUNLER_SUBDOMAIN`), the setting version 5 called
  `journal.tunnels.tunler.subdomain`.

It runs `tunler <port> --domain=<subdomain> --inspect=0` and accepts only the address of its own start line, and only
when that is the configured HTTPS origin.

**ngrok** requires a fixed HTTPS domain on the account; it never uses a random address. It needs the pinned program at
`sharing.ngrok.binary`, its own configuration folder at `sharing.ngrok.config_dir`, and the authtoken stored as a
secret file in `sharing.secrets_dir`, named by the configuration's secret reference. The journal writes ngrok's
configuration with the control API on `127.0.0.1` at `sharing.ngrok.control_port`, with no inspection and no log.

A gateway's readiness names each missing piece in a plain sentence for the owner.

## What the provider can see

The gateway provider, Tunler's host or ngrok, carries the traffic: it can see the public address and everything the
share shows. Turning off traffic inspection does not hide the content from the provider. The owner's preview says so
before a share is made.

## Keeping it running

A link works only while this machine, its containers and the share listener run. When the machine sleeps or is
offline the link cannot be reached. A share's deadline is checked on every read whatever its stored state says, so an
expired share is never read, and revoking works whenever the journal's own database is available.

## Excluded

Anonymous edits, invitations, extra link passwords, snapshot exports or history, public global search, delivery of
attachment files, publishing phases or tasks, permanent links, changing an expiry, provider account administration or
runtime installers, migrating version 5 links, and dedicated secret rotation are not part of sharing.
