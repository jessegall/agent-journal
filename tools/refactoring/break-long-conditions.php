<?php

declare(strict_types=1);

/*
 * Breaks a PHP line wider than 120 characters before each of its outermost logical or ternary operators (&&, ||, and,
 * or, ?, :, ??), each continuation on its own line one indent deeper, the operator first.
 *
 * Usage: php tools/refactoring/break-long-conditions.php <folder or file>...
 */

const LIMIT = 120;

const BREAK_BEFORE = [T_BOOLEAN_AND, T_BOOLEAN_OR, T_LOGICAL_AND, T_LOGICAL_OR, T_COALESCE];

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
 * Whether the token is an operator a long line breaks before: a logical one, a null coalescing one, or the parts of a
 * ternary (a single question mark, and the colon that closes it).
 */
function breaksBefore(PhpToken $token): bool
{
    return in_array($token->id, BREAK_BEFORE, true) || $token->text === '?';
}

$changedFiles = 0;
$brokenLines = 0;

foreach (phpFiles(array_slice($argv, 1)) as $file) {
    $source = (string) file_get_contents($file);
    $lines = explode("\n", $source);
    $tokens = PhpToken::tokenize($source);
    $byLine = [];

    foreach ($tokens as $index => $token) {
        $byLine[$token->line][] = $index;
    }

    $breaks = [];

    foreach ($lines as $number => $line) {
        $lineNumber = $number + 1;
        $trimmed = ltrim($line);

        if (strlen($line) <= LIMIT || $trimmed === '' || $trimmed[0] === '*' || str_starts_with($trimmed, '//')) {
            continue;
        }

        $depth = 0;
        $candidates = [];
        $openTernaries = [];

        foreach ($byLine[$lineNumber] ?? [] as $index) {
            $token = $tokens[$index];

            if (in_array($token->text, ['(', '[', '{'], true) && $token->id < 256) {
                $depth++;
            }

            if (in_array($token->text, [')', ']', '}'], true) && $token->id < 256) {
                $depth--;
            }

            if (breaksBefore($token)) {
                $candidates[] = [$index, $depth];

                if ($token->text === '?') {
                    $openTernaries[$depth] = ($openTernaries[$depth] ?? 0) + 1;
                }
            }

            if ($token->text === ':' && $token->id < 256 && ($openTernaries[$depth] ?? 0) > 0) {
                $openTernaries[$depth]--;
                $candidates[] = [$index, $depth];
            }
        }

        if ($candidates === []) {
            continue;
        }

        $outermost = min(array_column($candidates, 1));
        preg_match('/^\s*/', $line, $indent);

        foreach ($candidates as [$index, $candidateDepth]) {
            if ($candidateDepth === $outermost) {
                $breaks[$index] = $indent[0].'    ';
            }
        }

        $brokenLines++;
    }

    if ($breaks === []) {
        continue;
    }

    $rewritten = '';

    foreach ($tokens as $index => $token) {
        if (isset($breaks[$index])) {
            $rewritten = rtrim($rewritten, ' ')."\n".$breaks[$index];
        }

        $rewritten .= $token->text;
    }

    file_put_contents($file, $rewritten);
    $changedFiles++;
}

printf("Broke %d lines in %d files.\n", $brokenLines, $changedFiles);
