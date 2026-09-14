# Files

Every file stored on this environment, in one list.

## Where files come from

- **Messages:** a file you attach to a message is kept with that message.
- **Documents:** files and folders attached to one of this environment's documents, or to a
  project document.

When a message's file is filed into a document, it moves there and shows under that
document.

## What each row shows

- The file's name. Click it to open the file.
- Where it came from, like *Message 12* or *Document 4*. Click that to go there.
- Its size and how long ago it was stored.
- A small preview if it is an image.

## What you can do

Browse and open files here. To add a file, attach it to a message or ask the agent to add it
to a document.

## How the agent uses files

- **Files on messages.** The agent sees a message's files when it reads the message, and can file one into a document with `journal messages file`.
- **Files on documents.** `journal docs files <n>` lists a document's attachments, and `journal docs paths <n>` gives their full paths to hand to a subagent.
