<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Agents\Drivers\Work\AccountOwners;
use App\Contracts\Events\Listener;
use App\Events\Sessions\DriverRequestAccepted;
use App\Hosts\HostWake;
use App\Models\Drivers\DriverRequest;
use App\Models\Sessions\SessionProcess;

/**
 * Wakes the worker of the request's runtime once the accepted request is committed, so it takes the request up.
 */
final readonly class WakeWorkerForRequest implements Listener
{
    public function __construct(private HostWake $wake, private AccountOwners $owners) {}

    public function handle(DriverRequestAccepted $fact): void
    {
        $request = DriverRequest::query()->withRuntime()->whereKey($fact->requestId)->sole();
        $this->wake->wakeRuntime($request->agent_runtime_id);
        $start = SessionProcess::findCurrentOf($request->runtime->agent_session_id);

        if ($start !== null && $this->owners->serves($request->runtime)) {
            $this->wake->wakeAccount($start);
        }
    }
}
