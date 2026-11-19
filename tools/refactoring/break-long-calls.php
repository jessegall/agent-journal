<?php

declare(strict_types=1);

/*
 * Breaks each PHP line wider than 120 characters at the opening bracket of its widest call or signature, so Pint then
 * lays the arguments out one per line. Lines that are conditions, strings or comments are left for a person.
 *
 * Usage: php tools/refactoring/break-long-calls.php <folder or file>...
 */

const LIMIT = 120;

/**
 * The PHP files under the given paths.
 *
 * @param  list<string>  $paths
 * @return list<string>
 */
function phpFiles(array $paths): array
{
    $files = [];

    foreach ($paths as $path) {
        if (is_file($path)) {
            $files[] = $path;

            continue;
        }

        $entries = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path, FilesystemIterator::SKIP_DOTS));

        foreach ($entries as $entry) {
            if ($entry->isFile() && str_ends_with($entry->getFilename(), '.php')) {
                $files[] = $entry->getPathname();
            }
        }
    }

    return $files;
}

/**
 * The tokens of the source with the line each starts on.
 *
 * @return list<array{text: string, line: int, kind: int|null}>
 */
function tokensOf(string $source): array
{
    $tokens = [];

    foreach (PhpToken::tokenize($source) as $token) {
        $tokens[] = ['text' => $token->text, 'line' => $token->line, 'kind' => $token->id < 256 ? null : $token->id];
    }

    return $tokens;
}

/**
 * Whether the line is one the script leaves alone: a condition, a comment, or a line made long by a string.
 */
function isLeftForAPerson(string $line): bool
{
    $trimmed = ltrim($line);

    return preg_match('/^(if|elseif|} elseif|while|foreach|for|\*|\/\/|\/\*|&&|\|\||->|\?|:)/', $trimmed) === 1;
}

/**
 * The index of the opening bracket on the line whose group is widest and closes on the same line, or null.
 *
 * @param  list<array{text: string, line: int, kind: int|null}>  $tokens
 */
function widestGroupOpening(array $tokens, int $lineNumber): int|null
{
    $best = null;
    $bestWidth = 0;
    $stack = [];

    foreach ($tokens as $index => $token) {
        if ($token['line'] > $lineNumber) {
            break;
        }

        if (isOpening($token)) {
            $stack[] = $index;
        }

        if (isClosing($token) && $stack !== []) {
            $open = array_pop($stack);

            if ($tokens[$open]['line'] !== $lineNumber || $token['line'] !== $lineNumber || $index - $open < 3) {
                continue;
            }

            if (! opensAList($tokens, $open)) {
                continue;
            }

            $width = 0;

            for ($inner = $open; $inner <= $index; $inner++) {
                $width += strlen($tokens[$inner]['text']);
            }

            if ($width > $bestWidth) {
                $best = $open;
                $bestWidth = $width;
            }
        }
    }

    return $best;
}

/**
 * Whether the token is a code bracket that opens a group; a bracket inside a string arrives as string text.
 *
 * @param  array{text: string, line: int, kind: int|null}  $token
 */
function isOpening(array $token): bool
{
    return $token['kind'] === null && ($token['text'] === '(' || $token['text'] === '[');
}

/**
 * Whether the token is a code bracket that closes a group.
 *
 * @param  array{text: string, line: int, kind: int|null}  $token
 */
function isClosing(array $token): bool
{
    return $token['kind'] === null && ($token['text'] === ')' || $token['text'] === ']');
}

/**
 * Whether the bracket opens an argument, parameter or array list, where a trailing comma is allowed: a square bracket
 * that starts an array, or a round one after a name, a variable, a closing bracket or the function keywords. A round
 * bracket after an operator or a control keyword only groups an expression.
 *
 * @param  list<array{text: string, line: int, kind: int|null}>  $tokens
 */
function opensAList(array $tokens, int $open): bool
{
    $before = null;

    for ($index = $open - 1; $index >= 0; $index--) {
        if (trim($tokens[$index]['text']) !== '') {
            $before = $tokens[$index];

            break;
        }
    }

    if ($before === null) {
        return false;
    }

    if ($tokens[$open]['text'] === '[') {
        return ! in_array($before['kind'], [T_VARIABLE, T_STRING, T_NAME_QUALIFIED, T_NAME_FULLY_QUALIFIED], true)
            && ! in_array($before['text'], [')', ']', '}'], true);
    }

    $keywords = [T_IF, T_ELSEIF, T_WHILE, T_FOR, T_FOREACH, T_SWITCH, T_MATCH, T_CATCH, T_ECHO, T_PRINT, T_RETURN];

    if (in_array($before['kind'], $keywords, true)) {
        return false;
    }

    return in_array($before['kind'], [
        T_STRING, T_VARIABLE, T_NAME_QUALIFIED, T_NAME_FULLY_QUALIFIED, T_NAME_RELATIVE, T_STATIC, T_FUNCTION, T_FN,
        T_ARRAY, T_ISSET, T_UNSET, T_LIST, T_NEW,
    ], true) || in_array($before['text'], [')', ']'], true);
}

/**
 * The index of the bracket that closes the one opened at the index.
 *
 * @param  list<array{text: string, line: int, kind: int|null}>  $tokens
 */
function closingOf(array $tokens, int $open): int
{
    $depth = 0;

    foreach (array_slice($tokens, $open, null, true) as $index => $token) {
        if (isOpening($token)) {
            $depth++;
        }

        if (isClosing($token)) {
            $depth--;
        }

        if ($depth === 0) {
            return $index;
        }
    }

    return $open;
}

/**
 * The indexes of the commas directly inside the bracket group, not inside a nested one.
 *
 * @param  list<array{text: string, line: int, kind: int|null}>  $tokens
 * @return list<int>
 */
function topLevelCommas(array $tokens, int $open, int $close): array
{
    $commas = [];
    $depth = 0;

    for ($index = $open + 1; $index < $close; $index++) {
        $token = $tokens[$index];

        if (isOpening($token) || ($token['kind'] === null && $token['text'] === '{') || $token['kind'] === T_CURLY_OPEN) {
            $depth++;
        }

        if (isClosing($token) || ($token['kind'] === null && $token['text'] === '}')) {
            $depth--;
        }

        if ($token['kind'] === null && $token['text'] === ',' && $depth === 0) {
            $commas[] = $index;
        }
    }

    return $commas;
}

/**
 * Whether the last thing before the closing bracket is already a comma.
 *
 * @param  list<array{text: string, line: int, kind: int|null}>  $tokens
 */
function isTrailingComma(array $tokens, int $close): bool
{
    for ($index = $close - 1; $index >= 0; $index--) {
        if (trim($tokens[$index]['text']) !== '') {
            return $tokens[$index]['text'] === ',';
        }
    }

    return false;
}

$changedFiles = 0;
$brokenLines = 0;

foreach (phpFiles(array_slice($argv, 1)) as $file) {
    $source = (string) file_get_contents($file);
    $lines = explode("\n", $source);
    $long = [];

    foreach ($lines as $number => $line) {
        if (strlen($line) > LIMIT && ! isLeftForAPerson($line)) {
            $long[] = $number + 1;
        }
    }

    if ($long === []) {
        continue;
    }

    $tokens = tokensOf($source);
    $breaks = [];

    foreach ($long as $lineNumber) {
        $open = widestGroupOpening($tokens, $lineNumber);

        if ($open !== null) {
            $breaks[$open] = true;
        }
    }

    if ($breaks === []) {
        continue;
    }

    $closings = [];
    $commas = [];
    $trailing = [];

    foreach (array_keys($breaks) as $open) {
        $close = closingOf($tokens, $open);
        $closings[$close] = true;

        foreach (topLevelCommas($tokens, $open, $close) as $comma) {
            $commas[$comma] = true;
        }

        if (! isTrailingComma($tokens, $close)) {
            $trailing[$close] = true;
        }
    }

    $rewritten = '';

    foreach ($tokens as $index => $token) {
        if (isset($trailing[$index])) {
            $rewritten .= ',';
        }

        if (isset($closings[$index])) {
            $rewritten .= "\n";
        }

        $rewritten .= $token['text'];

        if (isset($breaks[$index]) || isset($commas[$index])) {
            $rewritten .= "\n";
        }
    }

    file_put_contents($file, $rewritten);
    $changedFiles++;
    $brokenLines += count($breaks);
}

printf("Broke %d lines in %d files.\n", $brokenLines, $changedFiles);
