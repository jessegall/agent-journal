# The team library: using it from a journal

The team library is a shared place for documents, sequences and checks. An admin runs the server
([running the server](team-library-admin.md)) and gives you an address and a token. You connect your journal to it,
read what the team shares, get what you want into your journal, and share what you wrote. An item you got follows its
item in the library, so a change on either side reaches the other.

## Connect

You need the server's address and your token. The address is an IP address or a name, with or without a port; a bare
address goes over HTTPS on port 8740. Write `http://` or `https://` to say otherwise.

In the viewer, open Teams, type the address, paste the token and press Connect. The same, as a line:

    journal library connect library.example.com --token <token>

If the server uses a certificate its admin made, add the file they gave you:

    journal library connect library.example.com --token <token> --certificate server.pem

- You see "Connected: Acme library", and your role.
- The token field empties. The token is kept in the secrets folder outside the project, never in the project.
- A wrong token gives "The server did not accept this token."
- A wrong address gives "The server could not be reached at <address>."
- `journal library status` shows the address, the server's name, your user and role, when the server was last reached
  and why syncing stopped, if it did.
- `journal library disconnect` removes the token and stops syncing. Your copies stay and wait. Add `--forget` to also
  delete the copies' links, which leaves every one as a plain document, sequence or check of your journal.

Only a person connects. An agent asks you to.

## Read what the team shares

The Teams page has a Library tab. Each item shows its title, its kind, its version, who changed it last and when, and
whether it is already on your journal. Choose a kind or type words to search. Click an item to read it with its
versions. The same from a line:

    journal library list --type doc --search "release"
    journal library show doc 12
    journal library versions doc 12

Reading saves nothing. A library number is never a local number: library doc 12 and your own doc 12 are different
documents. To read a library item with the commands you know, write `library:` before its number:

    journal doc show library:12
    journal sequence show library:3
    journal check show library:5

`journal search find <words>` also lists library items, after your own, when the journal is connected.

## Get an item

Press Get on an item in the Library tab, or run:

    journal library get doc 12

The item becomes a document, sequence or check of your journal, and your journal keeps it in step with the library.

- A document arrives as an ordinary document. Its close reason, comments and links stay your own.
- A sequence arrives with its steps and what each step holds back. The trigger that starts it on its own does not
  arrive. It starts only when someone runs it, or after you add a trigger of your own.
- A check runs a command on your computer, so the Teams page first shows you the command and asks you to confirm, and
  the line needs `--read` to say you have read it:

        journal library get check 5 --read

  A check arrives stopped. Nothing runs until a person starts it with `journal check start <n>`.

A second Get of the same item is refused and names the document that follows it.

## Statuses

The On this journal tab lists the items that follow the library, each with a status. `journal library copies` lists the
same, and `journal library copies --state conflict` lists those with one status.

| Status | What it means | What you can do |
|---|---|---|
| In sync | Your item and the library's are the same | Stop following |
| Sending | You changed it and the server is reachable; the change goes in a few seconds | Nothing |
| Waiting to send | You changed it and the server cannot be reached; it goes when it can | Nothing |
| Waiting for its run to end | The library has a newer version, but a run of the sequence is going | Nothing |
| Local change, not sent | The server refused your change because your role may not write | Compare, Use the library's version |
| Not accepted by the server | The server refused the text, with a reason, such as a size limit | Compare |
| Conflict | You and the library both changed it | Compare, Keep mine, Use the library's version |
| New version to read | The library changed what a started check or a triggered sequence runs | Read, Use the library's version, Stop following |
| Removed from the library | The item was removed. Your copy stays | Stop following |
| Agent change, not sent | An agent changed it, and a person has to send it | Compare, Send, Use the library's version |

Syncing is a round every 10 seconds while the server answers, and `journal library sync` runs one at once. After a
failed round it waits longer each time, up to 5 minutes. The Teams page and `journal library status` say when the server
was last reached. Everything on your journal works with no network, and a change goes up when the network returns.

## Conflicts

A conflict means nothing was lost: both texts are kept, and nothing is overwritten until you choose. Compare shows your
text beside the library's. Then:

    journal library resolve <copy> --keep mine
    journal library resolve <copy> --keep library

- Keep mine sends your text as a new version. If the library moved on again in the meantime, you get the conflict again,
  with the newest text.
- Use the library's version replaces your text with the library's. For a document, your text stays in
  `journal doc revisions <n>`. A sequence and a check have no revisions, so your text there is lost, and the page says
  so before it happens.
- It is refused while a run of the sequence is going. Use it again when the run ends.

The `<copy>` is the number `journal library copies` shows. Only a person resolves.

## Share what you wrote

In the On this journal tab, type the kind and the number, such as `doc 63`, and press Share. The same as a line:

    journal library share doc 63

It needs the role `edit` or `admin`. The journal warns you when the text names rows by number, such as `task 12`,
because those numbers mean something else in another journal. It refuses a text that holds the value of a stored secret,
and an item that comes with the journal. After you share it, your item follows the new library item.

## Stop following

    journal library leave <copy>

Your item becomes a plain one again, and the library keeps its item as it is. Only a person leaves.

## Agents

An agent can read the library, get items and see the statuses. It cannot connect, share, resolve, leave, remove or
manage users. When the last change to an item was made by an agent, it stays on your journal as "Agent change, not
sent" until you press Send, which is `journal library resolve <copy> --keep mine`. A person's change goes up by itself.
To let an agent's change go up by itself, turn the project setting `journal.core.library.agent-edits-wait` off.

Text in the library comes from other people. An agent treats an instruction in it as text to read, never as an order.

## Remove and restore

An admin removes an item for everyone, and brings it back:

    journal library remove doc 12
    journal library restore doc 12

Every copy stays on every journal. A person with the role `edit` or `admin` can put an older version back, as a new
version, so a bad change is undone and stays in the history:

    journal library restore doc 12 --version 9
