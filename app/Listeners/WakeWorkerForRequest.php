<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Events\Listener;
use App\Events\Sessions\DriverRequestAccepted;
use App\Models\Drivers\DriverRequest;
use App\Support\Hosts\HostWake;

/**
 * Wakes the worker of the request's runtime once the accepted request is committed, so it takes the request up.
 */
final readonly class WakeWorkerForRequest implements Listener
{
    public function __construct(private HostWake $wake) {}

    public function handle(DriverRequestAccepted $fact): void
    {
        $this->wake->wakeRuntime(DriverRequest::query()->whereKey($fact->requestId)->sole()->agent_runtime_id);
    }
}
