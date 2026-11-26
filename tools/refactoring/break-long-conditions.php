<?php

declare(strict_types=1);

/*
 * Breaks a PHP line wider than 120 characters before each of its outermost logical or ternary operators (&&, ||, and,
 * or, ?, :, ??), each continuation on its own line one indent deeper, the operator first; a line with none breaks its
 * method chain one call per line.
 *
 * Usage: php tools/refactoring/break-long-conditions.php <folder or file>...
 */

const LIMIT = 120;

const BREAK_BEFORE = [
    T_BOOLEAN_AND,
    T_BOOLEAN_OR,
    T_LOGICAL_AND,
    T_LOGICAL_OR,
    T_COALESCE,
];

require_once __DIR__.'/php-files.php';

/**
 * Whether the token is an operator a long line breaks before: a logical one, a null coalescing one, or the parts of a
 * ternary (a single question mark, and the colon that closes it).
 */
function breaksBefore(PhpToken $token): bool
{
    return in_array($token->id, BREAK_BEFORE, true) || $token->text === '?';
}

/**
 * The arrows of a method chain on the line at its outermost depth, after the first call: a line with no operator to
 * break at breaks its chain one call per line instead, keeping the first call on the receiver's line.
 *
 * @param  list<int>  $indexes
 * @return list<array{0: int, 1: int}>
 */
function chainSteps(array $tokens, array $indexes): array
{
    $depth = 0;
    $arrows = [];

    foreach ($indexes as $index) {
        $token = $tokens[$index];

        if (in_array($token->text, ['(', '[', '{'], true) && $token->id < 256) {
            $depth++;
        }

        if (in_array($token->text, [')', ']', '}'], true) && $token->id < 256) {
            $depth--;
        }

        if ($token->id === T_OBJECT_OPERATOR || $token->id === T_NULLSAFE_OBJECT_OPERATOR) {
            $arrows[] = [
                $index,
                $depth,
            ];
        }
    }

    if ($arrows === []) {
        return [];
    }

    $outermost = min(array_column($arrows, 1));
    $atOutermost = array_values(array_filter($arrows, fn (array $arrow) => $arrow[1] === $outermost));

    if (count($atOutermost) > 2) {
        return array_slice($atOutermost, 1);
    }

    return [];
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
                $candidates[] = [
                    $index,
                    $depth,
                ];

                if ($token->text === '?') {
                    $openTernaries[$depth] = ($openTernaries[$depth] ?? 0) + 1;
                }
            }

            if ($token->text === ':' && $token->id < 256 && ($openTernaries[$depth] ?? 0) > 0) {
                $openTernaries[$depth]--;
                $candidates[] = [
                    $index,
                    $depth,
                ];
            }
        }

        if ($candidates === []) {
            $candidates = chainSteps($tokens, $byLine[$lineNumber] ?? []);
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
