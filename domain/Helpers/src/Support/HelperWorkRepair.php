<?php

declare(strict_types=1);

namespace Domain\Helpers\Support;

use App\Contracts\Actors\ActorGuidance;
use App\Contracts\Actors\AgentTexts;
use App\Contracts\Work\WorkRepair;
use App\Enums\WorkRepairOutcome;
use App\Values\AgentText;
use App\Values\WorkRepairRequest;
use Domain\Helpers\Models\HelperJob;

/**
 * Reopens a helper's finished job for repair on its own helper and checkout and wakes the helper with the findings;
 * work that is no helper job, or no longer finished, is not a helper's to repair.
 */
final readonly class HelperWorkRepair implements WorkRepair
{
    public function __construct(private ActorGuidance $guidance, private AgentTexts $texts) {}

    public function reopen(WorkRepairRequest $request): WorkRepairOutcome
    {
        $job = $request->work->type === HelperJob::LINK_TYPE
            ? HelperJob::query()->acrossActors()->whereKey($request->work->id)->lockForUpdate()->first()
            : null;

        if ($job === null || ! $job->isFinished()) {
            return WorkRepairOutcome::Unavailable;
        }

        $findings = $request->targetRef === null
            ? AgentText::of('helpers.repair', ['findings' => $request->findings])
            : AgentText::of('helpers.repair_onto', ['target' => $request->targetRef, 'findings' => $request->findings]);

        $job->reopenForRepair($this->texts->render($findings));
        $this->guidance->retain($request->worker, $findings, "repair:{$request->source}");

        return WorkRepairOutcome::Reopened;
    }
}
