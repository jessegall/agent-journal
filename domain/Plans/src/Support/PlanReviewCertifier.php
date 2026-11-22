<?php

declare(strict_types=1);

namespace Domain\Plans\Support;

use Domain\Plans\Exceptions\PlanReviewRefused;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\PhaseTask;
use Domain\Plans\Models\Plan;
use Domain\Plans\Models\PlanReviewEdition;
use Domain\Plans\Models\PlanReviewMember;
use Domain\Plans\Models\PlanReviewPhase;
use Domain\Tasks\Api\TaskReviewText;
use Domain\Tasks\Contracts\TaskReviewTexts;
use Domain\Tasks\Exceptions\TaskMissing;

/**
 * Certifies that a review edition still is the plan's content, under the plan's structure lock the caller holds: the
 * plan's revision, each phase in order with its revision, and each phase's members in order with their task
 * revisions, read in bounded batches through Tasks under shared locks in id order. A difference refuses the decision
 * as stale; a member the decider may not read refuses it as a whole, naming nothing of it.
 */
final readonly class PlanReviewCertifier
{
    public const int BATCH = 200;

    public function __construct(private TaskReviewTexts $texts) {}

    /**
     * @throws PlanReviewRefused
     */
    public function assertCurrent(Plan $plan, PlanReviewEdition $edition): void
    {
        if ($plan->revision !== $edition->plan_revision) {
            throw PlanReviewRefused::stale($plan->number, $edition->number);
        }

        $position = 0;
        $afterNumber = 0;

        do {
            $phases = Phase::headingsIn($plan->id, $afterNumber, self::BATCH);
            $frozen = PlanReviewPhase::pageOf($edition->id, $position, self::BATCH)->values();

            if ($phases->count() !== $frozen->count()) {
                throw PlanReviewRefused::stale($plan->number, $edition->number);
            }

            foreach ($phases->values() as $index => $phase) {
                $position++;
                $afterNumber = $phase->number;
                $heading = $frozen[$index];

                if ($heading->phase_id !== $phase->id || $heading->phase_revision !== $phase->revision) {
                    throw PlanReviewRefused::stale($plan->number, $edition->number);
                }

                $this->assertMembers($plan, $edition, $position, $phase);
            }
        } while ($phases->count() === self::BATCH);

        if (PlanReviewPhase::pageOf($edition->id, $position, 1)->isNotEmpty()) {
            throw PlanReviewRefused::stale($plan->number, $edition->number);
        }
    }

    /**
     * @throws PlanReviewRefused
     */
    private function assertMembers(Plan $plan, PlanReviewEdition $edition, int $phasePosition, Phase $phase): void
    {
        $afterPlace = 0;
        $afterMember = 0;

        do {
            $places = PhaseTask::pageOf($phase->id, $afterPlace, self::BATCH);
            $frozen = PlanReviewMember::pageOf($edition->id, $phasePosition, $afterMember, self::BATCH)->values();
            $texts = $this->readableTexts(array_values($places));

            if (count($texts) !== $frozen->count()) {
                throw PlanReviewRefused::stale($plan->number, $edition->number);
            }

            foreach ($texts as $index => $text) {
                $member = $frozen[$index];

                if ($member->task_id !== $text->id || $member->task_revision !== $text->revision) {
                    throw PlanReviewRefused::stale($plan->number, $edition->number);
                }

                $afterMember = $member->position;
            }

            $afterPlace = $places === [] ? $afterPlace : (int) array_key_last($places);
        } while (count($places) === self::BATCH);

        if (PlanReviewMember::pageOf($edition->id, $phasePosition, $afterMember, 1)->isNotEmpty()) {
            throw PlanReviewRefused::stale($plan->number, $edition->number);
        }
    }

    /**
     * @param  list<string>  $taskIds
     * @return list<TaskReviewText>
     *
     * @throws PlanReviewRefused
     */
    private function readableTexts(array $taskIds): array
    {
        if ($taskIds === []) {
            return [];
        }

        try {
            return $this->texts->textsOf($taskIds);
        } catch (TaskMissing $unreadable) {
            throw PlanReviewRefused::notWholePlan($unreadable);
        }
    }
}
