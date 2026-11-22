<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use InvalidArgumentException;

/**
 * A reader definition breaks its own grammar or limits; it is refused before it reads any output.
 */
final class ReaderDefinitionInvalid extends InvalidArgumentException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function placeholder(string $placeholder): self
    {
        return new self(
            "The placeholder '{$placeholder}' is not of the form {name:int}, {name:word}, {name:rest} or {name:text}.",
        );
    }

    public static function limit(string $limit, int $declaredLimit): self
    {
        return new self("The reader limit {$limit} must be above zero, not {$declaredLimit}.");
    }

    public static function summaryMissing(): self
    {
        return new self('A reader definition field is missing: rules needs the summary rule its contract requires.');
    }

    public static function field(string $field): self
    {
        return new self("A reader definition field is missing or of the wrong type: {$field}.");
    }

    protected function status(): int
    {
        return 422;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }
}
