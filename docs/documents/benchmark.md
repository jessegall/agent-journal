# Library search benchmark

The library must list and search 10,000 published records with a server p95 under 500 ms, a bounded page, and a
query count per page that does not grow with the page size.

## How to run it

On a database you can throw away, such as the test database in the Docker stack:

```
docker compose -p agent-journal-6 exec -T -e APP_ENV=testing -e DB_DATABASE=journal_hooks_test queue \
    php artisan migrate:fresh --force
docker compose -p agent-journal-6 exec -T -e APP_ENV=testing -e DB_DATABASE=journal_hooks_test queue \
    php artisan documents:benchmark --records=10000 --runs=50
```

`documents:benchmark` files documents and reports through the bus until the library holds `--records` of them, then
times each read `--runs` times after one warm-up read and prints the p50, the p95 and the queries one page costs.

## Data

- 10,000 records: three documents to each report, each with one revision.
- Every body is about 20 KiB of Markdown: 12 sections, each with a heading, two bullets and a paragraph repeated
  twelve times.
- Every tenth record holds the searched phrase "retention window", so a search matches about 1,000 records and returns
  the first page of 50.

## Environment

- PostgreSQL 18 (postgres:18-alpine) in the project's Docker stack, started with `random_page_cost=1.1`
  (compose.yaml), the usual value for SSD storage.
- PHP 8.5 in the queue container, on a laptop running Docker Desktop.

## Results

| Read | p50 | p95 | Queries a page |
|---|---:|---:|---:|
| Document list | 2.4 ms | 2.9 ms | 2 |
| Report list | 1.7 ms | 3.2 ms | 1 |
| Document search | 63.1 ms | 71.6 ms | 2 |
| Report search | 338.3 ms | 444.4 ms | 1 |
| Search that matches nothing | 3.9 ms | 4.7 ms | 1 |

The query count is fixed per page: a list reads its page and, for documents, their current revisions in one more
query, whatever the page size.

## What makes search fast

- **Trigram indexes:** each searched column (title, abstract and body of document revisions and of reports) has a
  trigram GIN index. The literal, case-blind match (`ILIKE '%words%'`) uses those indexes instead of reading every
  body.
- **Current revision on the document:** a document stores which revision is current (`documents.current_revision_id`).
  The search finds matching revisions through the indexes and keeps the documents whose current revision is among
  them. Reading the newest revision of each document first would check every document's text one by one: about
  2 seconds at this size.
- **Page cost setting:** at PostgreSQL's default `random_page_cost` of 4 the planner prefers reading the whole table
  to using the indexes. It does not count the cost of unpacking large stored bodies, and the search then takes about
  1.5 seconds.

## Limits

- **Report search:** report search is the slowest read, because these numbers come right after loading. Statistics
  were gathered once after loading, but with this few reports (2,500) the planner still reads the reports table
  directly for some searches.
- **Hardware:** the numbers are from one laptop; slower disks or a busier database raise them.
