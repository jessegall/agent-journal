<?php

declare(strict_types=1);

namespace App\Events\Accounts;

use App\Contracts\Accounts\SignInAttemptEvent;

/**
 * A sign-in attempt writes in the sign-in generation given.
 */
final readonly class SignInAttemptGenerationSet extends AccountEvent implements SignInAttemptEvent
{
    public function __construct(public string $driver, public string $attemptId, public int $generation) {}
}
