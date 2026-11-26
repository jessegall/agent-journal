<?php

declare(strict_types=1);

namespace App\Hooks;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * Fails a value that is neither a text nor an array, for a field a driver sends in either shape.
 */
final readonly class TextOrArrayRule implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (is_string($value) || is_array($value)) {
            return;
        }

        $fail('The :attribute must be a text or an array.');
    }
}
