<?php

declare(strict_types=1);

namespace App\Accounts\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use App\Exceptions\Concerns\ThrowsLater;
use RuntimeException;

/**
 * No sign-in attempt the actor may see has this id.
 */
final class SignInAttemptMissing extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    /**
     * @use ThrowsLater<SignInAttemptMissing>
     */
    use ThrowsLater;

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
