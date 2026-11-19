<?php

declare(strict_types=1);

/*
 * Splits a plain string literal that makes its line wider than 120 characters into concatenated parts at spaces, each
 * continuation on its own line one indent deeper, so every line fits. Strings with interpolation are left for a person.
 *
 * Usage: php tools/refactoring/split-long-strings.php <folder or file>...
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
 * The literal split into quoted parts joined by a dot, each continuation on a new line at the given indent, so that no
 * part starts past the first part's column and every line stays within the limit.
 */
function splitLiteral(string $literal, int $firstColumn, string $indent): string
{
    $quote = $literal[0];
    $body = substr($literal, 1, -1);
    $parts = [];
    $room = LIMIT - $firstColumn - 3;

    while (strlen($body) > $room) {
        $cut = strrpos(substr($body, 0, $room), ' ');

        if ($cut === false || $cut === 0) {
            break;
        }

        $piece = substr($body, 0, $cut + 1);

        if (str_ends_with($piece, '\\')) {
            break;
        }

        $parts[] = $quote.$piece.$quote;
        $body = substr($body, $cut + 1);
        $room = LIMIT - strlen($indent) - 5;
    }

    $parts[] = $quote.$body.$quote;

    return implode("\n".$indent.'.', $parts);
}

$changedFiles = 0;
$splitStrings = 0;

foreach (phpFiles(array_slice($argv, 1)) as $file) {
    $source = (string) file_get_contents($file);
    $tokens = PhpToken::tokenize($source);
    $lines = explode("\n", $source);
    $rewritten = '';
    $column = 0;
    $touched = false;

    $insideDoubleQuotes = false;

    foreach ($tokens as $token) {
        $text = $token->text;
        $line = $lines[$token->line - 1] ?? '';

        if ($token->id === ord('"')) {
            $insideDoubleQuotes = ! $insideDoubleQuotes;
        }

        if ($insideDoubleQuotes && $token->id === T_ENCAPSED_AND_WHITESPACE && strlen($line) > LIMIT
            && ! str_contains($text, "\n") && $column + strlen($text) > LIMIT) {
            preg_match('/^\s*/', $line, $indent);
            $cut = strrpos(substr($text, 0, max(1, LIMIT - $column - 3)), ' ');

            if ($cut !== false && $cut > 0 && ! str_ends_with(substr($text, 0, $cut + 1), '\\')) {
                $text = substr($text, 0, $cut + 1).'"'."\n".$indent[0].'    ."'.substr($text, $cut + 1);
                $touched = true;
                $splitStrings++;
            }
        }

        if ($token->id === T_CONSTANT_ENCAPSED_STRING && strlen($line) > LIMIT && strlen($text) > 40
            && ! str_contains($text, "\n") && $column + strlen($text) > LIMIT) {
            preg_match('/^\s*/', $line, $indent);
            $split = splitLiteral($text, $column, $indent[0].'    ');

            if ($split !== $text) {
                $text = $split;
                $touched = true;
                $splitStrings++;
            }
        }

        $rewritten .= $text;
        $lastNewline = strrpos($text, "\n");
        $column = $lastNewline === false ? $column + strlen($text) : strlen($text) - $lastNewline - 1;
    }

    if ($touched) {
        file_put_contents($file, $rewritten);
        $changedFiles++;
    }
}

printf("Split %d strings in %d files.\n", $splitStrings, $changedFiles);
