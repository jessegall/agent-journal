# Tools

A tool is a script the project keeps for a job that comes up again, like checking something, generating a file or running a routine task.

## Why tools exist

Instead of rewriting the same script every time, the agent saves it once with a short description: what it does, how to run it, and when to use it. Later sessions see the list and run the tool rather than writing it again.

Tools belong to the whole project, not to one environment.

## What you can do

- Browse the tools and read how each one is used.
- Edit a tool's description.
- Retire a tool that is no longer needed. It is kept, not deleted.

## How the agent uses tools

- **Seeing the list.** The start of each session says the project keeps tools, and `journal tools` shows the catalogue.
- **Running, not rewriting.** The agent runs one with `journal tools run <name>` instead of writing the same script again, and saves a new one with `journal tools add`.
