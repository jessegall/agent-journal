---
name: journal-graphify
description: Find code through the project's knowledge graph with graphify query, explain and path, using names from the code instead of questions; read it before you search the code while Graphify is on
---

# Finding code with Graphify

Graphify holds a map of this project: every class, function and file, and what calls what. One query shows you the code around
a subject and how it connects, which a grep cannot, and it costs far less context than reading files until you find it. Use it
to get your bearings, then read the exact lines you need.

## Word a query as names

Graphify matches the words of your query against the names in the code. It does not understand sentences and has no synonyms,
so a question matches stray pieces of unrelated names and returns noise.

Give it 2 to 4 names you expect to exist: a class, a function or a file.

```
graphify query "WorkerTestListings has_listing"
```

Not this:

```
graphify query "how does a worker know which tests to run"
```

When you do not know a name yet, take one from the task, a nearby file or an earlier result.

## Which command to use

| You want | Use |
| --- | --- |
| To enter an area you do not know | `graphify query "<names>"` |
| To understand one thing a result showed | `graphify explain "<name from the result>"` |
| To see how two known things connect | `graphify path "<first name>" "<second name>"` |

Start with a query, then explain a name from its result. Use path only when you know both names exactly.

## Reading the result

- A result that is cut off, or full of files you do not care about, means the names were too general. Name something more
  specific, or add `--budget 4000` for more of it.
- A result that names nothing useful is a reason to change the names, not to ask the same thing again.
- Once a query has shown you where the code is, read that file or grep for the exact line. Graphify finds the place; the file
  has the details.

## How often the journal reminds you

Searching the code many times without Graphify gets you a reminder at the 10th search and again at the 20th, and at the 25th your
search is refused until you have used Graphify. Using it starts the count again, so use it when it would really help you find
something, and early rather than after a long grep.
