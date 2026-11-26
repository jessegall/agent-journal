<?php

declare(strict_types=1);

namespace App\Terminals;

use App\Agents\Drivers\Commands\NotifyRequestProgress\NotifyRequestProgressCommand;
use App\Agents\Drivers\Enums\RequestProgress;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\TerminalGrant;

/**
 * What a host's report on a browser writer's operation settles: a carried out take issues the grant, a refused one
 * refuses it, a carried out release or cancel fences it, and the operation's payload is dropped once the host reported
 * how it ended.
 */
final readonly class TerminalGrantReports
{
    public function settle(DriverRequest $request, NotifyRequestProgressCommand $report): void
    {
        if (! $report->progress->isFinal()) {
            return;
        }

        $request->forgetPayload();
        $grant = TerminalGrant::query()->acrossActors()->settledBy($request->id)->first();

        if ($grant === null) {
            return;
        }

        if ($grant->take_request_id !== $request->id) {
            $this->settleRelease($grant, $report);

            return;
        }

        if ($report->progress === RequestProgress::Applied && $report->actualBinding !== null) {
            $grant->issue($report->actualBinding);

            return;
        }

        $grant->refuse();
    }

    private function settleRelease(TerminalGrant $grant, NotifyRequestProgressCommand $report): void
    {
        if ($report->progress !== RequestProgress::Applied) {
            return;
        }

        $grant->markReleased();
    }
}
