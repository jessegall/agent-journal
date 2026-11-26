<?php

declare(strict_types=1);

/**
 * The comments check: reads every comment of the project's PHP, frontend, Go and shell scripts and prints each that
 * tells history, narrates the code's steps, holds a forbidden word or runs past three lines of prose.
 *
 *   php tools/refactoring/comment-faults.php            every comment of the project
 *   php tools/refactoring/comment-faults.php <paths>    only the comments under the paths
 */
$root = dirname(__DIR__, 2);
chdir($root);

const FOLDERS = ['app', 'domain', 'tests', 'database', 'config', 'routes', 'bootstrap', 'resources/js', 'tools', 'scripts', '.docker', 'bin'];

const MOST_LINES = 3;

/**
 * The samples the check's own test judges, which a scan of the project leaves out.
 */
const SAMPLES = 'tests/Fixtures/Comments';

$paths = array_slice($argv, 1);
$rules = commentRules("{$root}/docs/naming/comment-words.txt", "{$root}/docs/naming/forbidden-words.txt");
$faults = [];

foreach (sourceFiles($paths === [] ? FOLDERS : $paths) as $file) {
    foreach (commentsOf($file) as [$line, $prose]) {
        foreach (faultsOf($prose, $rules) as $fault) {
            $faults[] = "{$file}:{$line}  {$fault}";
        }
    }
}

if ($faults === []) {
    echo "Every comment says what its code is for.\n";

    exit(0);
}

echo implode("\n", $faults)."\n".count($faults)." comments to rewrite.\n";

exit(1);

/**
 * Every rule as its kind, its pattern and why.
 *
 * @return list<array{string, string, string}>
 */
function commentRules(string $commentWords, string $forbiddenWords): array
{
    $rules = [];

    foreach (ruleLines($commentWords) as $line) {
        [$kind, $words, $why] = explode("\t", $line);
        $rules[] = [$kind, rulePattern($words), $why];
    }

    foreach (ruleLines($forbiddenWords) as $line) {
        [$word, $why] = explode("\t", $line);

        if (! str_starts_with($word, 'verb:')) {
            $rules[] = ['poetry', '/(?<![\w-])'.preg_quote($word, '/').'(?![\w-])/i', $why];
        }
    }

    return $rules;
}

/**
 * The pattern of a rule's words, whole words matched case-blind; words starting with ^ only open a sentence.
 */
function rulePattern(string $words): string
{
    if (str_starts_with($words, '^')) {
        return '/(?:^|[.!?:]\s+)'.preg_quote(substr($words, 1), '/').'(?![\w-])/';
    }

    return '/(?<![\w-])'.preg_quote($words, '/').'(?![\w-])/i';
}

/**
 * @return list<string>
 */
function ruleLines(string $file): array
{
    return array_values(array_filter(
        explode("\n", (string) file_get_contents($file)),
        fn (string $line) => $line !== '' && ! str_starts_with($line, '#'),
    ));
}

/**
 * The faults of one comment's prose lines; a word in quotes or backticks is named, not used, and is left alone.
 *
 * @param  list<string>  $prose
 * @param  list<array{string, string, string}>  $rules
 * @return list<string>
 */
function faultsOf(array $prose, array $rules): array
{
    $text = (string) preg_replace('/`[^`]*`|"[^"]*"|\'[^\'\s][^\']*\'/', '', implode(' ', $prose));
    $faults = [];

    foreach ($rules as [$kind, $pattern, $why]) {
        if (preg_match($pattern, $text, $match) === 1) {
            $faults[] = "{$kind} \"{$match[0]}\": {$why}";
        }
    }

    if (count($prose) > MOST_LINES) {
        $faults[] = 'long: '.count($prose).' lines of prose, at most '.MOST_LINES.': say less, or move it to a document';
    }

    return $faults;
}

/**
 * @param  list<string>  $paths
 * @return iterable<string>
 */
function sourceFiles(array $paths): iterable
{
    foreach ($paths as $path) {
        if (is_file($path)) {
            yield $path;

            continue;
        }

        if (! is_dir($path)) {
            continue;
        }

        foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path, FilesystemIterator::SKIP_DOTS)) as $file) {
            $name = $file->getPathname();

            if (! preg_match('#/(vendor|node_modules|testdata|storage)/#', $name) && (! str_contains($name, SAMPLES) || str_contains($path, SAMPLES)) && languageOf($name) !== null) {
                yield $name;
            }
        }
    }
}

function languageOf(string $file): string|null
{
    return match (pathinfo($file, PATHINFO_EXTENSION)) {
        'php' => 'php',
        'ts', 'vue', 'go' => 'slashes',
        'sh' => 'hash',
        default => null,
    };
}

/**
 * Each comment of the file with the line it starts on and its prose: the text without its markers, tag lines (an
 *
 * @param, a //go: directive) and code examples left out.
 *
 * @return list<array{int, list<string>}>
 */
function commentsOf(string $file): array
{
    $source = (string) file_get_contents($file);

    return match (languageOf($file)) {
        'php' => phpComments($source),
        'slashes' => markedComments($source, '//', true),
        'hash' => markedComments($source, '#', false),
        default => [],
    };
}

/**
 * @return list<array{int, list<string>}>
 */
function phpComments(string $source): array
{
    $comments = [];
    $pendingLine = 0;
    $pending = [];

    foreach (token_get_all($source) as $token) {
        if (! is_array($token) || $token[0] === T_WHITESPACE && substr_count($token[1], "\n") < 2) {
            continue;
        }

        if ($token[0] === T_COMMENT && str_starts_with($token[1], '//')) {
            $pendingLine = $pending === [] ? $token[2] : $pendingLine;
            $pending[] = trim(substr($token[1], 2));

            continue;
        }

        if ($pending !== []) {
            $comments[] = [$pendingLine, prose($pending)];
            $pending = [];
        }

        if ($token[0] === T_DOC_COMMENT || $token[0] === T_COMMENT) {
            $comments[] = [$token[2], prose(blockLines($token[1]))];
        }
    }

    if ($pending !== []) {
        $comments[] = [$pendingLine, prose($pending)];
    }

    return $comments;
}

/**
 * Comments that start with a marker, a run of consecutive lines being one comment; with blocks, /* *\/ too.
 *
 * @return list<array{int, list<string>}>
 */
function markedComments(string $source, string $marker, bool $hasBlocks): array
{
    $comments = [];
    $run = [];
    $runStart = 0;
    $block = null;
    $blockStart = 0;

    foreach (explode("\n", $source) as $index => $line) {
        $trimmed = trim($line);

        if ($block !== null) {
            $block[] = $line;

            if (str_contains($trimmed, '*/')) {
                $comments[] = [$blockStart, prose(blockLines(implode("\n", $block)))];
                $block = null;
            }

            continue;
        }

        if ($hasBlocks && str_starts_with($trimmed, '/*')) {
            if ($run !== []) {
                $comments[] = [$runStart, prose($run)];
                $run = [];
            }

            $block = [$line];
            $blockStart = $index + 1;

            if (str_contains(substr($trimmed, 2), '*/')) {
                $comments[] = [$blockStart, prose(blockLines($line))];
                $block = null;
            }

            continue;
        }

        if (str_starts_with($trimmed, $marker) && ! str_starts_with($trimmed, '#!')) {
            $runStart = $run === [] ? $index + 1 : $runStart;
            $run[] = trim(substr($trimmed, strlen($marker)));

            continue;
        }

        if ($run !== []) {
            $comments[] = [$runStart, prose($run)];
            $run = [];
        }
    }

    if ($run !== []) {
        $comments[] = [$runStart, prose($run)];
    }

    return $comments;
}

/**
 * The lines of a block comment without their markers and the one space after them, so an indented example stays
 * indented; a line with no marker loses its leading spaces.
 *
 * @return list<string>
 */
function blockLines(string $block): array
{
    return array_map(
        fn (string $line) => rtrim((string) preg_replace('#^\s*(?:(?:/\*\*?|\*(?!/)) ?)?#', '', str_replace('*/', '', $line))),
        explode("\n", $block),
    );
}

/**
 * The prose lines of a comment: blank lines, tag lines with the lines that go on from them up to the next blank line,
 * directives and code examples left out.
 *
 * @param  list<string>  $lines
 * @return list<string>
 */
function prose(array $lines): array
{
    $prose = [];
    $isExample = false;
    $isInTag = false;

    foreach ($lines as $line) {
        if (str_starts_with($line, '```')) {
            $isExample = ! $isExample;

            continue;
        }

        $isTag = preg_match('#^(@|go:|nolint|phpcs|phpstan-|psalm-|eslint|ts-|prettier|shellcheck|<|\$ |php |sh |journal )#', $line) === 1;
        $isInTag = $line !== '' && ($isTag || $isInTag);

        if (! $isExample && ! $isInTag && $line !== '' && preg_match('#^\s{2,}#', $line) !== 1) {
            $prose[] = $line;
        }
    }

    return $prose;
}
