<?php

declare(strict_types=1);

namespace Domain\Helpers\Support;

use App\Agents\Contracts\ActorGuidance;
use App\Supervision\Contracts\WorkRepair;
use App\Supervision\Enums\WorkRepairOutcome;
use App\Supervision\Values\WorkRepairRequest;
use Domain\Helpers\Models\HelperJob;

/**
 * Reopens a helper's finished job for repair on its own helper and checkout and wakes the helper with the findings;
 * work that is no helper job, or no longer finished, is not a helper's to repair.
 */
final readonly class HelperWorkRepair implements WorkRepair
{
    public function __construct(private ActorGuidance $guidance) {}

    public function reopen(WorkRepairRequest $request): WorkRepairOutcome
    {
        $job = $request->work->type === HelperJob::LINK_TYPE
            ? HelperJob::query()->acrossActors()->whereKey($request->work->id)->lockForUpdate()->first()
            : null;

        if ($job === null || ! $job->isFinished()) {
            return WorkRepairOutcome::Unavailable;
        }

        $findings = $request->targetRef === null
            ? "Repair your work: {$request->findings}"
            : "Repair your work onto {$request->targetRef}: {$request->findings}";

        $job->reopenForRepair($findings);
        $this->guidance->retain($request->worker, $findings, "repair:{$request->source}");

        return WorkRepairOutcome::Reopened;
    }
}
