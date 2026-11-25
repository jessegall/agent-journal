<?php

declare(strict_types=1);

namespace App\Commands\Runs\ReplayAssessment;

use App\Contracts\Bus\CommandHandler;
use App\Enums\Runs\LifecycleStatus;
use App\Enums\Runs\RunMode;
use App\Exceptions\ReplayRefused;
use App\Models\CommandRules\RuleRevision;
use App\Models\Runs\OutputAssessment;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Support\PartAssessments;
use App\Support\ProcessAdministration;
use App\Values\ApprovedPair;

/**
 * Replays only a finished normal part whose operation's contract is still the one it ran under, so a repaired reader
 * can give it a result without running anything again; the original assessment stays as it was.
 */
final readonly class ReplayAssessmentHandler implements CommandHandler
{
    public function __construct(private ProcessAdministration $administration, private PartAssessments $assessments) {}

    /**
     * @throws ReplayRefused
     */
    public function handle(ReplayAssessmentCommand $command): string
    {
        $part = PartRun::query()->whereKey($command->partRunId)->lockForUpdate()->sole();
        $run = ProcessRun::findForAnyActor($part->process_run_id);
        $actor = $command->dispatchedBy();

        if (! $this->administration->isGrantedToCaller() && ! $run->isByActor($actor)) {
            throw ReplayRefused::ofAnotherActor($part->id);
        }

        if ($run->mode !== RunMode::Normal) {
            throw ReplayRefused::evidenceRun($part->id);
        }

        if ($part->lifecycle !== LifecycleStatus::Ended) {
            throw ReplayRefused::notEnded($part->id);
        }

        $pairs = $this->assessments->pairOf($part);

        if ($pairs === []) {
            throw ReplayRefused::noPair($part->operation);
        }

        $this->checkSameContract($part, $pairs[0]);

        return $this->assessments->assess($part, $pairs[0]);
    }

    /**
     * @throws ReplayRefused
     */
    private function checkSameContract(PartRun $part, ApprovedPair $pair): void
    {
        $previous = OutputAssessment::findLatestOf($part);

        if ($previous === null) {
            return;
        }

        $assessedUnder = RuleRevision::query()->findOrFail($previous->rule_revision_id)->payload->contracts;

        if ($assessedUnder === [] || $assessedUnder[0]->digest() !== $pair->contract->digest()) {
            throw ReplayRefused::contractChanged($part->id);
        }
    }
}
