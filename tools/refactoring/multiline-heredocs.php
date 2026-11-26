<?php

declare(strict_types=1);

/*
 * Rewrites every double-quoted PHP string that holds two or more "\n" line breaks as a nowdoc, or as a heredoc when it
 * interpolates a variable or keeps another escape, so text with line breaks reads as the lines it is. A string whose
 * last line break ends it keeps that line break as an empty last line.
 *
 * Usage: php tools/refactoring/multiline-heredocs.php <folder or file>...
 */

require_once __DIR__.'/php-files.php';

const LEAST_LINE_BREAKS = 2;

/**
 * The text of a double-quoted string as a heredoc writes it: the line breaks real, a quote unescaped, and every other
 * escape and interpolation kept for the heredoc to read as the string did.
 */
function heredocBody(string $inner): string
{
    return str_replace(['\\n', '\\"'], ["\n", '"'], $inner);
}

/**
 * Whether the string reads the same as a nowdoc: nothing interpolated and no escape but a line break, a quote or a
 * backslash.
 */
function fitsNowdoc(string $inner): bool
{
    $withoutPlainEscapes = str_replace(['\\n', '\\"', '\\\\'], '', $inner);

    return ! str_contains($withoutPlainEscapes, '\\') && ! str_contains($withoutPlainEscapes, '$');
}

/**
 * A marker no line of the text equals.
 */
function markerFor(string $body): string
{
    $marker = 'TEXT';
    $lines = array_map(trim(...), explode("\n", $body));

    for ($number = 2; in_array($marker, $lines, true); $number++) {
        $marker = 'TEXT'.$number;
    }

    return $marker;
}

/**
 * The string rewritten as a nowdoc or heredoc whose lines and closing marker sit one indent deeper than the line the
 * string starts on.
 */
function rewritten(string $inner, string $indent): string
{
    $nowdoc = fitsNowdoc($inner);
    $body = $nowdoc ? str_replace(['\\n', '\\"', '\\\\'], ["\n", '"', '\\'], $inner) : heredocBody($inner);
    $marker = markerFor($body);
    $inside = $indent.'    ';
    $lines = array_map(fn (string $line) => $line === '' ? '' : $inside.$line, explode("\n", $body));
    $opening = $nowdoc ? "<<<'{$marker}'" : "<<<{$marker}";

    return $opening."\n".implode("\n", $lines)."\n".$inside.$marker;
}

$changedFiles = 0;
$rewrittenStrings = 0;

foreach (phpFiles(array_slice($argv, 1)) as $file) {
    $source = (string) file_get_contents($file);
    $tokens = PhpToken::tokenize($source);
    $output = '';
    $touched = false;
    $count = count($tokens);

    for ($index = 0; $index < $count; $index++) {
        $token = $tokens[$index];
        $lineStart = strrpos($output, "\n");
        $currentLine = $lineStart === false ? $output : substr($output, $lineStart + 1);
        preg_match('/^\s*/', $currentLine, $indent);

        if ($token->id === T_CONSTANT_ENCAPSED_STRING && $token->text[0] === '"') {
            $inner = substr($token->text, 1, -1);

            if (substr_count($inner, '\\n') >= LEAST_LINE_BREAKS && ! str_contains($inner, "\n")) {
                $output .= rewritten($inner, $indent[0]);
                $touched = true;
                $rewrittenStrings++;

                continue;
            }
        }

        if ($token->text === '"' && $token->id === ord('"')) {
            $close = $index + 1;

            while ($close < $count && ! ($tokens[$close]->text === '"' && $tokens[$close]->id === ord('"'))) {
                $close++;
            }

            $inner = implode('', array_map(fn (PhpToken $part) => $part->text, array_slice($tokens, $index + 1, $close - $index - 1)));

            if (substr_count($inner, '\\n') >= LEAST_LINE_BREAKS && ! str_contains($inner, "\n")) {
                $output .= rewritten($inner, $indent[0]);
                $touched = true;
                $rewrittenStrings++;
                $index = $close;

                continue;
            }
        }

        $output .= $token->text;
    }

    if ($touched) {
        file_put_contents($file, $output);
        $changedFiles++;
    }
}

printf("Rewrote %d strings in %d files.\n", $rewrittenStrings, $changedFiles);
