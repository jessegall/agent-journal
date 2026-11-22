<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Commands\ReportRequestProgress\ReportRequestProgressCommand;
use App\Agents\Enums\RequestProgress;
use App\Agents\Models\DriverRequest;
use App\Agents\Models\TerminalGrant;

/**
 * What a host's report on a browser writer's operation settles: a carried out take issues the grant under the id the
 * host gave it, a refused one refuses it, a carried out release or cancel marks the grant fenced, and the operation's
 * payload, a writer's typed text included, is dropped once the host said how it ended.
 */
final readonly class TerminalGrantReports
{
    public function settle(DriverRequest $request, ReportRequestProgressCommand $report): void
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

    private function settleRelease(TerminalGrant $grant, ReportRequestProgressCommand $report): void
    {
        if ($report->progress !== RequestProgress::Applied) {
            return;
        }

        $grant->markReleased();
    }
}
