<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use InvalidArgumentException;

/**
 * Text that does not name a record the way users name one, such as 'plan 0' or 'task 1e3'.
 */
final class InvalidRecordReference extends InvalidArgumentException implements CodedRefusal
{
    use RendersRefusal;

    public static function number(string $text): self
    {
        return new self(
            sprintf(
                '%s is no record number: write a positive whole number such as 12, without sign, leading zeros or spaces.',
                $text,
            ),
        );
    }

    public static function parentMissing(string $type, string $parent): self
    {
        return new self("A {$type} number is counted within its {$parent}: name the {$parent} too.");
    }

    public static function unreadable(string $text): self
    {
        return new self("{$text} names no record: write its type and number, such as plan 12.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }

    protected function status(): int
    {
        return 422;
    }
}
