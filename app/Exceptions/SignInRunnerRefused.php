<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * The journal refused this sign-in runner's claim, such as a runner of the other arrangement; the runner waits and
 * asks again rather than give up.
 */
final class SignInRunnerRefused extends RuntimeException
{
    public static function byJournal(string $reason): self
    {
        return new self($reason);
    }
}
