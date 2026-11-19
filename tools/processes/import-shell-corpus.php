<?php

declare(strict_types=1);

/*
 * Builds the portable shell corpus in tests/Fixtures/Processes/ShellCorpus from version 5's checked-in fixtures (doc 21
 * revision 3, sections 34 and 35): every splitter line, every recorded correction, every distilled command shape and chain, the
 * 500-case seed-7 sample, one deterministic case per shape with its optional pieces kept and dropped, wrapper and
 * redirect boundaries, and the synthetic adversarial cases. Cases are deduplicated by source, dialect and context, keeping
 * every origin. The expected block stays empty until the structural expectations are frozen; decisions.jsonl starts
 * empty. Malformed input fails the tool, and running it twice writes the same bytes.
 *
 *   php tools/processes/import-shell-corpus.php <version-5 checkout>
 *
 * The seed-7 sample comes from tools/processes/generated-sample-seed-7.jsonl, exported once by a test run in a scratch
 * copy of version 5's own hook module, because PHP's random numbers cannot reproduce Go's PCG.
 */

const SCHEMA_VERSION = 1;
const DIALECT = 'bash';
const CONTEXT = 'synthetic-default';
const SOURCE_FOLDER = 'tools/journal-hook/testdata/version4';
const SAMPLE_FILE = __DIR__.'/generated-sample-seed-7.jsonl';
const OUTPUT_FOLDER = __DIR__.'/../../tests/Fixtures/Processes/ShellCorpus';

/**
 * The first value of each slot type, so a per-shape case is the same on every run.
 */
const SLOT_VALUES = [
    'word' => 'alpha', 'path' => 'src/app/main.py', 'pattern' => "'TODO'", 'number' => '3', 'text' => "'a short note'",
    'glob' => "'*.py'", 'string' => "'hello'", 'variable' => '$NAME', 'code' => "'print(1)'", 'file' => 'notes.txt',
    'assignment' => 'NAME=value', 'substitution' => '$(pwd)', 'branch' => 'feature-x', 'revision' => 'HEAD~1', 'empty' => "''",
    'url' => 'https://example.com/api', 'version' => '1.2.3', 'test name' => 'test_app.py::test_runs', 'range' => '1,20p',
    'address' => '127.0.0.1', 'date' => '2.weeks.ago', 'number range' => '1-5', 'json' => "'{\"a\": 1}'", 'duration' => '30s',
    'stdin' => '-', 'email' => 'someone@example.com',
];

/**
 * Where a wrapper or a redirect changes what a command is: each pair is the same command with and without it.
 *
 * @var list<array{string, string}>
 */
const BOUNDARY_CASES = [
    ['git status', 'boundary: plain'],
    ['env NAME=value git status', 'boundary: env wrapper'],
    ['timeout 30s npm test', 'boundary: timeout wrapper'],
    ['npm test', 'boundary: plain'],
    ['nice -n 10 npm test', 'boundary: nice wrapper'],
    ['git status > out.log', 'boundary: output redirect'],
    ['git status >> out.log 2>&1', 'boundary: appending redirect with stderr'],
    ['git diff < notes.txt', 'boundary: input redirect'],
    ['git log | head -n 3', 'boundary: pipe'],
    ['git branch -d feature-x', 'boundary: option absent (safe delete)'],
    ['git branch -D feature-x', 'boundary: option present (forced delete)'],
    ['git push', 'boundary: option absent'],
    ['git push --force', 'boundary: option present'],
    ['rm notes.txt', 'boundary: option absent'],
    ['rm -rf build/out', 'boundary: option present'],
    ['sed -n 1,20p notes.txt', 'boundary: option absent (read)'],
    ['sed -i s/a/b/ notes.txt', 'boundary: option present (edit)'],
];

/**
 * The adversarial shapes of doc 21 sections 14 to 16 and 30: quoting, nesting, expansion, multiline text and empty input.
 *
 * @var list<array{string, string, string}>
 */
const ADVERSARIAL_CASES = [
    ['', 'bash', 'empty input'],
    ['   ', 'bash', 'blank input'],
    ['echo "unclosed', 'bash', 'unclosed double quote'],
    ["echo 'unclosed", 'bash', 'unclosed single quote'],
    ['echo done )', 'bash', 'lone closing parenthesis'],
    ["cat <<'EOF'\nhello\nEOF", 'bash', 'quoted here-document'],
    ["git status\ngit diff", 'bash', 'two lines'],
    ['bash -c "git push"', 'bash', 'nested shell'],
    ['sh -c \'rm -rf build/out\'', 'bash', 'nested shell with a delete'],
    ['eval "$COMMAND"', 'bash', 'eval of a variable'],
    ['x=$(git rev-parse HEAD) && echo $x', 'bash', 'command substitution in an assignment'],
    ['echo "$(cat "$(pwd)/notes.txt")"', 'bash', 'nested substitution inside quotes'],
    ['echo `git status`', 'bash', 'backtick substitution'],
    ['(cd src && make)', 'bash', 'subshell'],
    ['{ git status; git diff; }', 'bash', 'group'],
    ['git status && git diff || git log', 'bash', 'and then or'],
    ['git log | grep fix | wc -l > out.log 2>&1', 'bash', 'pipeline with redirects'],
    ['echo "" \'\' ""', 'bash', 'empty arguments'],
    ['echo \\$HOME', 'bash', 'escaped dollar'],
    ['diff <(git show HEAD:a) <(git show HEAD~1:a)', 'bash', 'process substitution'],
    ['for f in *.py; do wc -l "$f"; done', 'bash', 'for loop'],
    ['if test -f notes.txt; then cat notes.txt; fi', 'bash', 'if statement'],
    ['git status &', 'bash', 'background job'],
    ['print -l ${(f)LINES}', 'zsh', 'zsh parameter flags'],
    ['echo ${NAME:-default}', 'bash', 'parameter default'],
    ['find . -name "*.py" -exec rm {} \\;', 'bash', 'find with exec delete'],
    ['xargs -0 rm < out.log', 'bash', 'xargs delete'],
];

/**
 * Families of shell syntax the portable corpus names as not supported, each with the grammar reason.
 */
const UNSUPPORTED_FAMILIES = [
    ['family' => 'zsh-glob-qualifiers', 'reason' => 'Zsh glob qualifiers such as *(.) change what a word expands to and are outside the Bash grammar the parser implements.'],
    ['family' => 'arithmetic-commands', 'reason' => '(( )) and let evaluate expressions, not commands; they are read as one opaque word.'],
    ['family' => 'coprocesses', 'reason' => 'coproc starts a background command with its own pipes, which the tree does not model.'],
    ['family' => 'function-definitions', 'reason' => 'A function body runs later under another name; its parts are not commands of this line.'],
];

main($argv);

/**
 * @param  list<string>  $arguments
 */
function main(array $arguments): void
{
    $version5 = rtrim($arguments[1] ?? fail('Name the version-5 checkout: php tools/processes/import-shell-corpus.php <folder>'), '/');
    $sources = sourceFiles($version5);

    $cases = new CaseSet();
    $splitterLines = readJsonLines($sources['splitter_lines.jsonl']);
    foreach ($splitterLines as $index => $line) {
        $source = stringField($line, 'line', "splitter line {$index}");
        $cases->add($source, DIALECT, ['type' => 'splitter-line', 'index' => $index], ['splitter_parts' => $line['parts'] ?? null]);
    }

    $corrections = readJson($sources['splitter_corrections.json']);
    foreach (listOf($corrections, 'splitter_corrections.json') as $index => $correction) {
        $source = stringField($correction, 'line', "correction {$index}");
        $cases->add($source, DIALECT, ['type' => 'splitter-correction', 'index' => $index], ['corrected_parts' => $correction['parts'] ?? null, 'reason' => $correction['reason'] ?? null]);
    }

    $shapesFixture = readJson($sources['generated_forms.json']);
    $shapes = listOf($shapesFixture['forms'] ?? fail('generated_forms.json has no shapes'), 'shapes');
    $chains = listOf($shapesFixture['chains'] ?? fail('generated_forms.json has no chains'), 'chains');
    $shapeRows = [];
    foreach ($shapes as $index => $shape) {
        $text = stringField($shape, 'form', "shape {$index}");
        $shapeId = 'shape-'.substr(hash('sha256', $text), 0, 12);
        $shapeRows[] = ['id' => $shapeId, 'program' => stringField($shape, 'program', "shape {$index}"), 'subcommand' => stringField($shape, 'subcommand', "shape {$index}"), 'text' => $text];
        foreach (['kept' => true, 'dropped' => false] as $optional => $keep) {
            $cases->add(filledShape($text, $keep), DIALECT, ['type' => 'shape', 'id' => $shapeId, 'optional' => $optional], []);
        }
    }
    $chainRows = [];
    foreach ($chains as $index => $chain) {
        $parts = listOf($chain, "chain {$index}");
        $chainRows[] = ['id' => 'chain-'.substr(hash('sha256', implode(' ', $parts)), 0, 12), 'parts' => $parts];
    }

    $differences = readJson($sources['generated_differences.json']);
    $generated = readJsonLines(SAMPLE_FILE);
    if (count($generated) !== 500) {
        fail('The seed-7 sample must hold 500 rows, it holds '.count($generated));
    }
    foreach ($generated as $index => $row) {
        $source = stringField($row, 'source', "generated row {$index}");
        $cases->add($source, DIALECT, ['type' => 'generated', 'seed' => 7, 'index' => $index], [
            'shapes_say' => $row['forms'] ?? null,
            'version5_read' => $row['observed'] ?? null,
            'known_difference' => is_array($differences) ? ($differences[$source] ?? null) : null,
        ]);
    }

    foreach (BOUNDARY_CASES as $index => [$source, $note]) {
        $cases->add($source, DIALECT, ['type' => 'boundary', 'index' => $index, 'note' => $note], []);
    }
    foreach (ADVERSARIAL_CASES as $index => [$source, $dialect, $note]) {
        $cases->add($source, $dialect, ['type' => 'adversarial', 'index' => $index, 'note' => $note], []);
    }

    $folder = OUTPUT_FOLDER;
    if (! is_dir($folder) && ! mkdir($folder, 0o755, true)) {
        fail("Cannot create {$folder}");
    }
    $files = [
        'cases.jsonl' => $cases->jsonLines(frozenExpectations("{$folder}/cases.jsonl")),
        'shapes.json' => encode(['schema_version' => SCHEMA_VERSION, 'slot_values' => SLOT_VALUES, 'shapes' => $shapeRows, 'chains' => $chainRows])."\n",
        'decisions.jsonl' => '',
    ];
    foreach ($files as $name => $content) {
        file_put_contents("{$folder}/{$name}", $content);
    }

    $manifest = [
        'schema_version' => SCHEMA_VERSION,
        'qualification_scope' => 'portable',
        'source' => [
            'repository' => 'agent-journal version 5',
            'revision' => trim((string) shell_exec('git -C '.escapeshellarg($version5).' rev-parse HEAD')),
            'files' => array_map(fn (string $path): string => hash_file('sha256', $path), [...$sources, 'generated-sample-seed-7.jsonl' => SAMPLE_FILE]),
        ],
        'generated' => ['seed' => 7, 'count' => 500, 'random' => 'Go math/rand/v2 PCG(7, 7), exported by a test run of version 5'],
        'defaults' => ['dialect' => DIALECT, 'context' => CONTEXT],
        'counts' => [
            'splitter_lines' => count($splitterLines),
            'corrections' => count(listOf($corrections, 'splitter_corrections.json')),
            'shapes' => count($shapes),
            'chains' => count($chains),
            'generated' => count($generated),
            'known_generated_differences' => is_array($differences) ? count($differences) : 0,
            'boundary_cases' => count(BOUNDARY_CASES),
            'adversarial_cases' => count(ADVERSARIAL_CASES),
            'empty_inputs' => $cases->emptyInputs(),
            'inputs' => $cases->inputs(),
            'cases' => $cases->count(),
            'origins' => $cases->origins(),
        ],
        'unsupported_families' => UNSUPPORTED_FAMILIES,
        'decisions_schema' => ['case_id', 'legacy_outcome', 'intended_outcome', 'reason', 'reference'],
        'fixtures' => array_map(fn (string $content): string => hash('sha256', $content), $files),
    ];
    file_put_contents("{$folder}/manifest.json", encode($manifest)."\n");

    fwrite(STDOUT, "{$cases->inputs()} inputs, {$cases->count()} cases written to tests/Fixtures/Processes/ShellCorpus\n");
}

/**
 * The cases, one per source, dialect and context, each keeping every origin it was found in.
 */
final class CaseSet
{
    /**
     * @var array<string, array{id: string, source: string, dialect: string, context: string, origins: list<array<string, mixed>>, legacy: list<array<string, mixed>>, expected: object}>
     */
    private array $cases = [];

    private int $inputs = 0;

    private int $emptyInputs = 0;

    private int $origins = 0;

    /**
     * @param  array<string, mixed>  $origin
     * @param  array<string, mixed>  $legacy
     */
    public function add(string $source, string $dialect, array $origin, array $legacy): void
    {
        $this->inputs++;
        $this->origins++;
        if (trim($source) === '') {
            $this->emptyInputs++;
        }
        $key = hash('sha256', json_encode([$source, $dialect, CONTEXT], JSON_THROW_ON_ERROR));
        $this->cases[$key] ??= ['id' => 'case-'.substr($key, 0, 16), 'source' => $source, 'dialect' => $dialect, 'context' => CONTEXT, 'origins' => [], 'legacy' => [], 'expected' => new stdClass()];
        $this->cases[$key]['origins'][] = $origin;
        if ($legacy !== []) {
            $this->cases[$key]['legacy'][] = ['origin' => $origin['type'], ...$legacy];
        }
    }

    /**
     * @param  array<string, mixed>  $expected  the frozen expected block of each case id, kept across imports
     */
    public function jsonLines(array $expected): string
    {
        $cases = $this->cases;
        ksort($cases);
        foreach ($cases as $key => $case) {
            $cases[$key]['expected'] = $expected[$case['id']] ?? $case['expected'];
        }

        return implode('', array_map(fn (array $case): string => json_encode($case, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)."\n", array_values($cases)));
    }

    public function count(): int
    {
        return count($this->cases);
    }

    public function inputs(): int
    {
        return $this->inputs;
    }

    public function emptyInputs(): int
    {
        return $this->emptyInputs;
    }

    public function origins(): int
    {
        return $this->origins;
    }
}

/**
 * The expected blocks freeze-shell-corpus.php wrote into an earlier import, by case id.
 *
 * @return array<string, mixed>
 */
function frozenExpectations(string $path): array
{
    if (! is_file($path)) {
        return [];
    }

    $expected = [];
    foreach (file($path, FILE_IGNORE_NEW_LINES) ?: [] as $line) {
        $case = json_decode($line, true, 512, JSON_THROW_ON_ERROR);
        $expected[$case['id']] = $case['expected'];
    }

    return $expected;
}

/**
 * A command shape with every optional piece kept or dropped and each slot given the first value of its type.
 */
function filledShape(string $shape, bool $keepOptional): string
{
    $optional = preg_replace_callback('/\[([^\]]*)\]/', fn (array $match): string => $keepOptional ? $match[1] : '', $shape);
    $filled = preg_replace_callback('/<([^>]+)>/', fn (array $match): string => SLOT_VALUES[$match[1]] ?? 'value', (string) $optional);

    return implode(' ', preg_split('/\s+/', trim((string) $filled)) ?: []);
}

/**
 * @return array<string, string>
 */
function sourceFiles(string $version5): array
{
    $files = [];
    foreach (['splitter_lines.jsonl', 'splitter_corrections.json', 'generated_forms.json', 'generated_differences.json'] as $name) {
        $path = $version5.'/'.SOURCE_FOLDER.'/'.$name;
        $files[$name] = is_file($path) ? $path : fail("Missing version-5 fixture {$name}");
    }

    return $files;
}

/**
 * @return list<array<string, mixed>>
 */
function readJsonLines(string $path): array
{
    $rows = [];
    foreach (file($path, FILE_IGNORE_NEW_LINES) ?: fail("Cannot read {$path}") as $number => $line) {
        try {
            $row = json_decode($line, true, 512, JSON_THROW_ON_ERROR);
        } catch (JsonException $error) {
            fail(basename($path).' line '.($number + 1).' is not JSON: '.$error->getMessage());
        }
        $rows[] = is_array($row) ? $row : fail(basename($path).' line '.($number + 1).' is not an object');
    }

    return $rows;
}

function readJson(string $path): mixed
{
    try {
        return json_decode((string) file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);
    } catch (JsonException $error) {
        fail(basename($path).' is not JSON: '.$error->getMessage());
    }
}

/**
 * @return list<mixed>
 */
function listOf(mixed $value, string $what): array
{
    return is_array($value) && array_is_list($value) ? $value : fail("{$what} is not a list");
}

/**
 * @param  array<string, mixed>  $row
 */
function stringField(array $row, string $field, string $what): string
{
    return is_string($row[$field] ?? null) ? $row[$field] : fail("{$what} has no {$field}");
}

function encode(mixed $value): string
{
    return json_encode($value, JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
}

function fail(string $message): never
{
    fwrite(STDERR, "import-shell-corpus: {$message}\n");
    exit(1);
}
