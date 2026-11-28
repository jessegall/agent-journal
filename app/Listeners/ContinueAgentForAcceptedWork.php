<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Bus\Attributes\RetriedWhenItFails;
use App\Contracts\Events\Listener;
use App\Events\Sessions\DriverRequestAccepted;
use App\Models\Drivers\DriverRequest;

/**
 * Accepted work continues its agent, as the agent's driver decides: the next turn opens when none runs, a running
 * terminal takes the work itself, and a host-run driver continues nothing of its own.
 */
#[RetriedWhenItFails]
final readonly class ContinueAgentForAcceptedWork implements Listener
{
    public function __construct(private DriverCatalogue $drivers) {}

    public function handle(DriverRequestAccepted $fact): void
    {
        $request = DriverRequest::query()->withRuntime()->whereKey($fact->requestId)->sole();

        if ($request->operation->startsWork()) {
            $this->drivers->forRuntime($request->runtime)->continueAgent($request->runtime);
        }
    }
}
