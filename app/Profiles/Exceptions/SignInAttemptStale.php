<?php

declare(strict_types=1);

namespace App\Profiles\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A sign-in result that no longer speaks for its attempt: the attempt ended, its deadline passed, or the account
 * moved on to a newer sign-in generation. It changes nothing.
 */
final class SignInAttemptStale extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function for(string $attemptId): self
    {
        return new self("Sign-in attempt {$attemptId} has ended or was overtaken; its result is ignored.");
    }

    protected function status(): int
    {
        return 409;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::StateBlocked;
    }
}
