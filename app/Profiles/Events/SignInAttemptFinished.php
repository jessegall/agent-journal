<?php

declare(strict_types=1);

namespace App\Profiles\Events;

use App\Contracts\Event;

/**
 * A sign-in attempt ended without completing: cancelled, failed, interrupted or expired; the account it wrote, if
 * any, is released by the required listener in the same transaction.
 */
final readonly class SignInAttemptFinished implements Event
{
    public function __construct(public string $attemptId, public string|null $accountId) {}
}
