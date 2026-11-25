<?php

declare(strict_types=1);

namespace App\Events\Accounts;

use App\Contracts\Accounts\SignInAttemptEvent;
use App\Enums\Accounts\SignInStatus;

/**
 * A sign-in attempt ended in the state given.
 */
final readonly class SignInAttemptEnded implements AccountEvent, SignInAttemptEvent
{
    public function __construct(public string $driver, public string $attemptId, public SignInStatus $state) {}
}
