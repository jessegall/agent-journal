# The team library: running the server

The team library lets the people of a team share documents, sequences and checks. It has one small program, the
server `journal-shared`, which you run on a machine everyone can reach. Each person's journal connects to it. This page is
for the person who runs the server. [The team library for a person](team-library.md) says how to use it from a journal.

## What you need

- A machine the team can reach over the network, with a folder for the server's data.
- The program for that machine's system, `journal-shared-<system>-<processor>`, from the release, with `checksums.txt`
  beside it. Check the file against the checksum, then make it executable and name it `journal-shared`.
- Nothing else: it is one file, and the data is one folder.

`journal-shared --version` prints the program's version and the version of its protocol. A journal and a server must
have the same protocol, or the server answers that it is not supported.

## Step 1: make the first admin

The data folder is named with `--data` on every command. The folder is made if it is not there.

    journal-shared user add Ada --role admin --data /var/lib/journal-shared

The answer names the user and prints a token once. Copy the token now: the server keeps only a digest of it and can
never show it again.

## Step 2: start the server

    journal-shared serve --data /var/lib/journal-shared --listen 0.0.0.0:8740 --tls-cert cert.pem --tls-key key.pem

- With no `--listen` the server answers only on its own machine (`127.0.0.1:8740`), so a new server is not reachable
  from the network until you say so. Port 8740 is the one a journal tries when the address has no port.
- `--tls-cert` and `--tls-key` go together. With them the server speaks HTTPS; without them, plain HTTP.
- The server prints nothing while it runs. Stop it with Ctrl-C or by stopping its process.

**Use HTTPS.** A token and every document cross the network on each request. Over plain HTTP anyone on the network can
read them. The journal works the same over either, and does not warn, so the choice is yours to make. A certificate
from a certificate authority needs nothing more. A certificate you made yourself works too: each person gives the file
to `journal library connect --certificate <file>`, and their journal then trusts that certificate when it talks to the server.

Keep the process running with the tool your machine uses for services. The server needs no other setup.

## Roles

| Role | What the person can do |
|---|---|
| `read` | Read and get documents, sequences and checks |
| `edit` | Everything `read` can, and share items, change them, and restore an old version of one |
| `admin` | Everything `edit` can, and remove an item, bring back a removed item, and manage users and tokens |

The server decides, on every request. A journal that asks for more than its person's role gets a refusal in plain words.

## Users

    journal-shared user add Grace --role edit --data /var/lib/journal-shared
    journal-shared user role Grace admin --data /var/lib/journal-shared
    journal-shared user tokens Grace --data /var/lib/journal-shared
    journal-shared user remove Grace --data /var/lib/journal-shared

- `user add` makes the user and prints a first token once. Send it to the person by a way that only they read.
- `user role` changes a role; it holds from the person's next request.
- `user tokens` lists a user's tokens with their label, when each was made and last used, and whether it is revoked.
- `user remove` removes the user and revokes every token of theirs. Their documents stay.

An admin can do the same from a journal, on the Teams page in the People tab, or with `journal library-user list`,
`add`, `role`, `remove`, `tokens` and `revoke`. The tab and the commands show only to an admin, and the server refuses
anyone else.

## Tokens

A token is a person's way in. A person can have more than one, one for each device.

    journal-shared token new Grace --label laptop --data /var/lib/journal-shared
    journal-shared token revoke 7 --data /var/lib/journal-shared

- `token new` prints a new token once. The label says what it is for.
- `token revoke` takes the token's number, from `user tokens`. That one device stops working; the person's other
  tokens go on.

If a laptop is lost, revoke its token. The journal on it will say "The server did not accept this token." if it comes
online, and its local copies stay as plain documents of that journal. A person can also revoke their own tokens.

## Backups

Everything the server holds is in its data folder, in the database file `shared.db`. Write a backup while the server runs:

    journal-shared backup /var/backups/journal-shared-2026-11-04.db --data /var/lib/journal-shared

A backup is written to a new file, and the command refuses a file that exists. To restore, stop the server and put the
file in place of `shared.db` in the data folder. After a restore, a journal may find an item at an older version than
it last saw; it keeps its own copy and asks the person which version to keep.

## Looking into an item

Every change of an item is kept, with the user and the token that made it.

    journal-shared item history doc 12 --data /var/lib/journal-shared
    journal-shared item purge doc 12 --data /var/lib/journal-shared

- `item history` lists the versions of an item. A person can see the same with `journal library versions doc 12`.
- `item purge` deletes an item and all its versions for good, and its number is never used again. Use it only to
  remove something that must not be kept, such as a secret that was pasted by mistake. To take an item out of sight and
  keep its history, use `journal library remove doc 12`, which an admin can undo with `journal library restore doc 12`.

## What the server does not do

- It has no passwords and no sign-in page: access is by token.
- It has no projects. Everyone connected sees every item. Two groups that must not see each other's items need two
  servers.
- It keeps only documents, sequences and checks, and the title, text and steps of each. Close reasons, comments, links,
  results of a check and the triggers of a sequence stay in each journal.
