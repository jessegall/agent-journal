# Code and prose corpus

`code_and_prose.json.gz` is the corpus of `../codeDetection.test.js`: samples of code and of prose, each marked with the
repo, the path and the language it was cut from, and a split. It is kept small on disk (160 KB packed) and was fetched
once from GitHub; the test never goes to the network.

## What it holds

- 1000 code samples: 3 to 10 consecutive lines cut from source files of C, C++, C#, CSS, Go, Java, JavaScript, JSON,
  Kotlin, PHP, Python, Ruby, Rust, shell, SQL, Swift, TypeScript and YAML. Windows made mostly of comments were left out.
- 600 prose samples: 500 paragraphs of English from the same repos' Markdown, reStructuredText and text files, and 100
  lists (bullets with continuation lines).
- 43 repos, each pinned to the commit it was read at. Every sample is a short excerpt kept as a test input.
- The repos are split half and half: the detection was calibrated on the `calibration` samples, and the `held out`
  samples are checked beside them.

## Licences

Every repo is under a permissive licence, so excerpts may be kept with this notice. Each repo's own licence text is in
the repo at the commit named in the corpus (`repos` in the file). Copyright stays with each project's authors.

| Licence | Repos |
|---|---|
| MIT | tiangolo/fastapi, expressjs/express, axios/axios, lodash/lodash, facebook/react, colinhacks/zod, vuejs/core, trpc/trpc, gin-gonic/gin, junegunn/fzf, tokio-rs/tokio, nlohmann/json, fmtlib/fmt, rails/rails, sinatra/sinatra, jekyll/jekyll, laravel/framework, symfony/symfony, composer/composer, nvm-sh/nvm, ohmyzsh/ohmyzsh, Alamofire/Alamofire, JamesNK/Newtonsoft.Json, twbs/bootstrap, sqlalchemy/sqlalchemy, vitejs/vite, actions/checkout |
| Apache-2.0 | psf/requests, spf13/cobra, gohugoio/hugo, sharkdp/bat, serde-rs/serde, google/guava, spring-projects/spring-petclinic, square/okhttp |
| BSD-3-Clause | pallets/flask, pallets/click, encode/httpx, django/django, google/googletest |
| BSD-2-Clause | nginx/nginx |
| Unlicense | BurntSushi/ripgrep |
| curl licence (MIT-like) | curl/curl |

GitHub reads lodash and curl as `NOASSERTION`; both licence files are permissive and the corpus names them MIT and curl.
Redis was left out: its current licence is not permissive.

## How the corpus was made

Files were chosen evenly from each repo's tree (no vendored, generated, minified or test-fixture paths), cut with a fixed
random seed, and the first 1000 code windows and 600 prose paragraphs kept. Only the packed file is kept in the repo.

## The share right before and after

A sample is right when the formatter shows code as a code block and prose as no code block. Measured on all 1600 samples
with `render` from `src/viewer/src/text`:

| | Before | After |
|---|---|---|
| Code shown as a code block | 752 of 1000 (75.2%) | 992 of 1000 (99.2%) |
| Prose left as text | 500 of 500 (100%) | 494 of 500 (98.8%) |
| Lists left as lists | 91 of 100 (91.0%) | 100 of 100 (100%) |
| All samples | 1343 of 1600 (83.9%) | 1586 of 1600 (99.1%) |
| Calibration samples | 601 of 733 (82.0%) | 724 of 733 (98.8%) |
| Held-out samples | 742 of 867 (85.6%) | 862 of 867 (99.4%) |

"Before" is the formatter as it was before the calibration, which took only indented lines for code. The 600 prose
samples are the 500 paragraphs and the 100 lists. Two changes were made after looking at held-out misses (indented bullet lists were read as code), so the held-out
share is a check, not a clean test.

The test states 98% of all samples, 97% of each type and 97% of the held-out samples.
