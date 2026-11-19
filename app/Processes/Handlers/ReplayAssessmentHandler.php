<?php

declare(strict_types=1);

namespace App\Processes\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Processes\Commands\ReplayAssessment;
use App\Processes\Enums\LifecycleState;
use App\Processes\Enums\RunMode;
use App\Processes\Exceptions\ReplayRefused;
use App\Processes\Models\OutputAssessment;
use App\Processes\Models\PartRun;
use App\Processes\Models\ProcessRun;
use App\Processes\Models\RuleRevision;
use App\Processes\Support\PartAssessments;
use App\Processes\Support\ProcessAdministration;
use App\Processes\Values\ApprovedPair;

/**
 * Replays only a finished normal part whose operation's contract is still the one it ran under, so a repaired reader
 * can give it a result without running anything again; the original assessment stays as it was.
 */
final readonly class ReplayAssessmentHandler implements CommandHandler
{
    public function __construct(private CurrentActor $actors, private ProcessAdministration $administration, private PartAssessments $assessments) {}

    /**
     * @throws ReplayRefused
     */
    public function handle(ReplayAssessment $command): string
    {
        $part = PartRun::query()->whereKey($command->partRunId)->lockForUpdate()->sole();
        $run = ProcessRun::query()->withoutGlobalScopes()->findOrFail($part->process_run_id);
        $actor = ActorIdentity::of($this->actors->actor());
        if (! $this->administration->isGrantedToCaller() && ! $run->isByActor($actor)) {
            throw ReplayRefused::notYours($part->id);
        }
        if ($run->mode !== RunMode::Normal) {
            throw ReplayRefused::evidenceRun($part->id);
        }
        if ($part->lifecycle !== LifecycleState::Ended) {
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
        $previous = OutputAssessment::query()->where('part_run_id', $part->id)->latest('created_at')->first();
        if ($previous === null) {
            return;
        }
        $assessedUnder = RuleRevision::query()->findOrFail($previous->rule_revision_id)->payload->contracts;
        if ($assessedUnder === [] || $assessedUnder[0]->digest() !== $pair->contract->digest()) {
            throw ReplayRefused::contractChanged($part->id);
        }
    }
}
