<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\CodedRefusal;
use App\Contracts\CommandRefusal;
use App\Enums\RefusalCode;
use App\Values\ProfileKey;
use RuntimeException;

/**
 * A profile key with no profile, or a profile with no activated revision: no start can read it.
 */
final class ProfileMissing extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function for(ProfileKey $key): self
    {
        return new self("There is no profile {$key}.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::ProfilesUnavailable;
    }

    protected function status(): int
    {
        return 404;
    }
}
