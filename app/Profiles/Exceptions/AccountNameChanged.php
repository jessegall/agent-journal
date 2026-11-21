<?php

declare(strict_types=1);

namespace App\Profiles\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A name saved against an older name of the account: someone renamed it meanwhile, so this save writes nothing and
 * names the name now saved; saving again against that one replaces it.
 */
final class AccountNameChanged extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function meanwhile(string $savedLabel): self
    {
        return new self("This account was renamed to {$savedLabel} meanwhile. Your name is kept: save again to use it.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Conflict;
    }

    protected function status(): int
    {
        return 409;
    }
}
