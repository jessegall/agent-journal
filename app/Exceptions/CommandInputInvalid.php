<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\ValidationException;

/**
 * A command whose input breaks the rules on its properties; the message names every wrong field and never its value.
 */
final class CommandInputInvalid extends ValidationException implements CodedRefusal, CommandRefusal
{
    public static function from(Validator $validator): self
    {
        $refusal = new self($validator);

        $refusal->message = implode("\n", ['The input was refused.', ...$refusal->fieldProblems()]);

        return $refusal;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }

    /**
     * Each wrong field with its first problem, in the order the validator found them.
     *
     * @return list<string>
     */
    private function fieldProblems(): array
    {
        return array_map(
            fn (string $field, array $problems) => "{$field}: {$problems[0]}",
            array_keys($this->errors()),
            $this->errors(),
        );
    }
}
