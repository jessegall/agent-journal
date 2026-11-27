<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Agents\Drivers\Work\RuntimeWorkers;
use App\Contracts\Events\Listener;
use App\Events\Sessions\DriverRequestApplied;
use App\Models\Drivers\DriverRequest;

/**
 * A request that was applied may release the ones behind it, as an interrupt releases the runtime's held work, so
 * the workers that take them are woken to claim what comes next.
 */
final readonly class WakeWorkerForNextRequest implements Listener
{
    public function __construct(private RuntimeWorkers $workers) {}

    public function handle(DriverRequestApplied $fact): void
    {
        $this->workers->wake(DriverRequest::query()->withRuntime()->whereKey($fact->requestId)->sole()->runtime);
    }
}
