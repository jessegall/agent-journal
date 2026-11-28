<?php

declare(strict_types=1);

namespace App\Values;

/**
 * A shell line as the journal shows it to users: a line that looks like it carries a secret keeps only its first
 * word, followed by "with a private value".
 */
final readonly class ShownShellLine
{
    private const string SECRET_WORDS = '~token|secret|passw|api[_-]?key|authorization|bearer|credential~i';

    public static function of(string $line): string
    {
        if (preg_match(self::SECRET_WORDS, $line) === 1) {
            return strtok($line, " \t\n").' with a private value';
        }

        return $line;
    }
}
