<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\CodedRefusal;
use App\Contracts\CommandRefusal;
use App\Enums\RefusalCode;
use InvalidArgumentException;

/**
 * A dollar amount that is negative, not a plain decimal, or holds more than twelve decimals, which are never cut off.
 */
final class UsdAmountInvalid extends InvalidArgumentException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function for(string $text): self
    {
        $shown = mb_substr($text, 0, 40);

        return new self("A dollar amount is a nonnegative decimal with at most 12 decimals; \"{$shown}\" is not.");
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
