<?php

declare(strict_types=1);

namespace App\Events\Accounts;

use App\Contracts\Accounts\SignInAttemptEvent;
use App\Enums\Accounts\SignInState;

/**
 * A sign-in attempt ended in the state given.
 */
final readonly class SignInAttemptEnded extends AccountEvent implements SignInAttemptEvent
{
    public function __construct(public string $driver, public string $attemptId, public SignInState $state) {}
}
