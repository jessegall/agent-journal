<?php

declare(strict_types=1);

namespace App\Profiles\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use App\Profiles\Values\AccountLabel;
use RuntimeException;

/**
 * Another saved account of the same program already has this name, ignoring case.
 */
final class AccountLabelTaken extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function for(string $program, AccountLabel $label): self
    {
        return new self("Another {$program} account is already named \"{$label->label}\".");
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
