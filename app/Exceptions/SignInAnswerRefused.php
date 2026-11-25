<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use RuntimeException;

/**
 * An answer the attempt cannot take: it is not waiting for one, or its sign-in asks for none. Nothing reaches the
 * driver.
 */
final class SignInAnswerRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function notWaiting(string $attemptId): self
    {
        return new self("Sign-in attempt {$attemptId} is not waiting for an answer.");
    }

    public static function asksForNone(string $attemptId): self
    {
        return new self("Sign-in attempt {$attemptId} is approved on the provider's page and takes no answer.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::StateBlocked;
    }

    protected function status(): int
    {
        return 409;
    }
}
