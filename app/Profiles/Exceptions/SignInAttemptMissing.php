<?php

declare(strict_types=1);

namespace App\Profiles\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * No sign-in attempt the actor may see has this id.
 */
final class SignInAttemptMissing extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function for(string $attemptId): self
    {
        return new self("No sign-in attempt {$attemptId} is known.");
    }

    protected function status(): int
    {
        return 404;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::RecordUnavailable;
    }
}
