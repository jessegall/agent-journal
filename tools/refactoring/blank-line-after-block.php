<?php

declare(strict_types=1);

/**
 * Puts a blank line after every closing brace that a statement follows at the same indentation.
 *
 *   php tools/refactoring/blank-line-after-block.php app domain tests
 *   php tools/refactoring/blank-line-after-block.php --check app domain tests
 *       lists each place instead and fails while there is one.
 *
 * A brace followed by else, catch, finally, another closing brace or bracket, a chained call, a comment or a trait
 * use keeps its place, and a brace inside a string or heredoc is no block.
 */
require_once __DIR__.'/php-files.php';

const KEEPS_ITS_PLACE = '/^(\}|\)|\]|else\b|elseif\b|catch\b|finally\b|while\b|->|\?->'
    .'|\/\/|\/\*|\*|#|case\b|default\b|use\b|\?>)/';

/**
 * The line numbers, counted from 1, of each code brace that closes a block alone on its line.
 *
 * @return list<int>
 */
function blockEndLines(string $code): array
{
    $lines = [];

    foreach (PhpToken::tokenize($code) as $token) {
        if ($token->text === '}') {
            $lines[] = $token->line;
        }
    }

    return $lines;
}

/**
 * The file's lines with a blank line after each block end a statement follows, and the line numbers it was added at.
 *
 * @param  list<string>  $lines
 * @param  list<int>  $blockEnds
 * @return array{list<string>, list<int>}
 */
function withBlankLines(array $lines, array $blockEnds): array
{
    $added = [];

    foreach (array_reverse($blockEnds) as $number) {
        $brace = $lines[$number - 1];
        $next = $lines[$number] ?? '';

        if (preg_match('/^(\s*)\}$/', $brace, $match) !== 1) {
            continue;
        }

        $indentation = $match[1];
        $statement = substr($next, strlen($indentation));

        if (! str_starts_with($next, $indentation) || $statement === '' || ctype_space($statement[0])) {
            continue;
        }

        if (preg_match(KEEPS_ITS_PLACE, $statement) === 1) {
            continue;
        }

        array_splice($lines, $number, 0, ['']);
        $added[] = $number;
    }

    return [$lines, array_reverse($added)];
}

$check = ($argv[1] ?? '') === '--check';
$paths = array_slice($argv, $check ? 2 : 1);
$places = 0;

foreach (phpFiles($paths) as $file) {
    $code = (string) file_get_contents($file);
    $lines = explode("\n", $code);
    [$spaced, $added] = withBlankLines($lines, blockEndLines($code));

    if ($added === []) {
        continue;
    }

    $places += count($added);

    if ($check) {
        foreach ($added as $number) {
            echo "{$file}:{$number}\n";
        }

        continue;
    }

    file_put_contents($file, implode("\n", $spaced));
}

echo $check ? "{$places} closing braces want a blank line after them\n" : "{$places} blank lines added\n";

exit($check && $places > 0 ? 1 : 0);
