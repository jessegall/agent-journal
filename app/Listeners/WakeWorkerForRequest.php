<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Agents\Drivers\Work\RuntimeWorkers;
use App\Contracts\Events\Listener;
use App\Events\Sessions\DriverRequestAccepted;
use App\Models\Drivers\DriverRequest;

/**
 * Wakes the worker of the request's runtime once the accepted request is committed, so it takes the request up.
 */
final readonly class WakeWorkerForRequest implements Listener
{
    public function __construct(private RuntimeWorkers $workers) {}

    public function handle(DriverRequestAccepted $fact): void
    {
        $this->workers->wake(DriverRequest::query()->withRuntime()->whereKey($fact->requestId)->sole()->runtime);
    }
}
