<?php

declare(strict_types=1);

namespace App\Processes\Readers\Support;

/**
 * Applies the terminal sequences a reader supports to one line: colour and style codes are dropped, and a carriage
 * return keeps only the text written after it. Any other control character is destructive and stays, so the line
 * reads as unrecognized.
 */
final readonly class LineNormalizer
{
    public function normalize(string $line): string
    {
        $line = (string) preg_replace('/\e\[[0-9;]{0,32}m/', '', rtrim($line, "\r"));
        $carriageReturn = strrpos($line, "\r");

        return $carriageReturn === false ? $line : substr($line, $carriageReturn + 1);
    }

    public function hasUnsupportedControl(string $line): bool
    {
        return preg_match('/[\x00-\x08\x0B-\x1F\x7F]/', $line) === 1;
    }
}
