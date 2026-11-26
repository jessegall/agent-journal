<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Events\Listener;
use App\Events\Sessions\DriverRequestAccepted;
use App\Models\Drivers\DriverRequest;
use App\Support\Drivers\HeadlessStarts;

/**
 * Accepted work of a runtime the journal drives itself opens its next turn, when none of it runs.
 */
final readonly class OpenTurnForAcceptedWork implements Listener
{
    public function __construct(private HeadlessStarts $headless) {}

    public function handle(DriverRequestAccepted $fact): void
    {
        $request = DriverRequest::query()->with('runtime')->whereKey($fact->requestId)->sole();

        // A terminal takes its work from its own driver worker; only a headless runtime opens a turn for it.
        $runtime = $request->runtime;
        $isTurnByTurn = $this->headless->drives($runtime) && ! $this->headless->opensTerminal($runtime);

        if ($request->operation->startsWork() && $isTurnByTurn) {
            $this->headless->openNextTurn($request->agent_runtime_id);
        }
    }
}
