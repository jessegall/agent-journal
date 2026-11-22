<?php

declare(strict_types=1);

namespace Domain\Plans\Support;

use App\Actors\Support\ActorIdentity;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\PhaseTask;
use Domain\Plans\Models\Plan;
use Domain\Plans\Models\PlanReviewEdition;
use Domain\Plans\Models\PlanReviewMember;
use Domain\Plans\Models\PlanReviewPhase;
use Domain\Tasks\Contracts\TaskReviewTexts;
use Domain\Tasks\Exceptions\TaskMissing;
use HashContext;

/**
 * Freezes a plan's content for review in bounded batches, under the plan's structure lock the caller holds: the
 * plan's text, its phase headings in order, and each phase's tasks with a copy of their texts read through Tasks under
 * shared locks; the fingerprint is a hash over that ordered content, fed as it is read.
 */
final readonly class PlanReviewFreezer
{
    public const int BATCH = 200;

    public function __construct(private TaskReviewTexts $texts) {}

    /**
     * @throws TaskMissing
     */
    public function freeze(Plan $plan, ActorIdentity $actor): PlanReviewEdition
    {
        $edition = PlanReviewEdition::open($plan, $actor);
        $hash = hash_init('sha256');
        hash_update($hash, (string) json_encode([$plan->title, $plan->brief, $plan->type->value]));
        $position = 0;
        $afterNumber = 0;

        do {
            $phases = Phase::headingsIn($plan->id, $afterNumber, self::BATCH);

            foreach ($phases as $phase) {
                $position++;
                $afterNumber = $phase->number;
                PlanReviewPhase::record($edition, $position, $phase);
                hash_update($hash, (string) json_encode(['phase', $position, $phase->number, $phase->title]));
                $this->freezeMembers($edition, $position, $phase, $hash);
            }
        } while ($phases->count() === self::BATCH);

        $edition->seal(hash_final($hash));

        return $edition;
    }

    private function freezeMembers(
        PlanReviewEdition $edition,
        int $phasePosition,
        Phase $phase,
        HashContext $hash,
    ): void {
        $afterPosition = 0;
        $memberPosition = 0;

        do {
            $page = PhaseTask::pageOf($phase->id, $afterPosition, self::BATCH);

            foreach ($this->texts->textsOf(array_values($page)) as $text) {
                $memberPosition++;
                PlanReviewMember::record($edition, $phasePosition, $memberPosition, $text);
                hash_update($hash, (string) json_encode([
                    'task',
                    $phasePosition,
                    $memberPosition,
                    $text->number,
                    $text->title,
                    $text->brief,
                ]));
            }

            $afterPosition = $page === [] ? $afterPosition : (int) array_key_last($page);
        } while (count($page) === self::BATCH);
    }
}
