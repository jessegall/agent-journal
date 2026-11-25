<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use App\Values\ProfileKey;
use RuntimeException;

/**
 * A main start names a profile whose base does not coordinate the journal's work.
 */
final class ProfileCannotCoordinate extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function for(ProfileKey $key): self
    {
        return new self("Profile {$key} does not coordinate the journal's work, so it cannot run as the main agent.");
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
