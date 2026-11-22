<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\CodedRefusal;
use App\Contracts\CommandRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

/**
 * A challenge whose link leads somewhere other than the driver's own sign-in pages: it is never shown, and the refusal
 * names no link.
 */
final class SignInChallengeRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function untrustedAddress(string $attemptId): self
    {
        return new self(
            "Sign-in attempt {$attemptId} printed a link outside its provider's sign-in pages; it is not shown.",
        );
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
