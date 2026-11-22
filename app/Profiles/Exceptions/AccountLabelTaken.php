<?php

declare(strict_types=1);

namespace App\Profiles\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * Another saved account of the same driver already has this name, ignoring case.
 */
final class AccountLabelTaken extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function for(string $driver, string $label): self
    {
        return new self("Another {$driver} account is already named \"{$label}\".");
    }

    protected function status(): int
    {
        return 409;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Conflict;
    }
}
