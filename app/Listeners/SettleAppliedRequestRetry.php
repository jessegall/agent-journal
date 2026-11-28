<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Agents\Drivers\Enums\RetryOutcome;
use App\Attributes\Listeners\InCommandTransaction;
use App\Contracts\Events\Listener;
use App\Events\Sessions\DriverRequestApplied;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\RetryAttempt;

/** Records success of the retry that applied the driver request. */
#[InCommandTransaction]
final readonly class SettleAppliedRequestRetry implements Listener
{
    public function handle(DriverRequestApplied $fact): void
    {
        $request = DriverRequest::query()->whereKey($fact->requestId)->sole();
        $attempt = RetryAttempt::findForVersion($request);
        $attempt?->settle(RetryOutcome::Succeeded);
    }
}
