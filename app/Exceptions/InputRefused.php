<?php

declare(strict_types=1);

namespace App\Exceptions;

/**
 * The journal refused the input: the journal answered invalid_input.
 */
final class InputRefused extends ApiRefused
{
    public const string CODE = 'invalid_input';

    /**
     * Each refused field with its messages.
     *
     * @return array<string, list<string>>
     */
    public function fieldMessages(): array
    {
        $fields = $this->details['fields'] ?? [];

        if (is_array($fields)) {
            return $fields;
        }

        return [];
    }
}
