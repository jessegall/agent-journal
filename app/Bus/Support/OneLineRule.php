<?php

declare(strict_types=1);

namespace App\Bus\Support;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * Fails a text with a line break between two words; leading and trailing blanks and line breaks pass.
 */
final readonly class OneLineRule implements ValidationRule
{
    private const string BREAK_INSIDE_TEXT = '/\S[^\S\r\n]*[\r\n]\s*\S/';

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value) || preg_match(self::BREAK_INSIDE_TEXT, $value) !== 1) {
            return;
        }

        $fail('The :attribute must be one line; remove its line breaks.');
    }
}
