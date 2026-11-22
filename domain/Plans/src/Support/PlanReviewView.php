<?php

declare(strict_types=1);

namespace Domain\Plans\Support;

use App\Actors\Contracts\CurrentAuthorizer;
use App\Operations\Enums\AccessType;
use Domain\Plans\Data\PlanEditionChangesData;
use Domain\Plans\Data\PlanReviewData;
use Domain\Plans\Data\PlanReviewEditionData;
use Domain\Plans\Data\PlanReviewMemberData;
use Domain\Plans\Data\PlanReviewPhaseData;
use Domain\Plans\Data\PlanReviewReceiptData;
use Domain\Plans\Enums\PlanReviewState;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Models\Plan;
use Domain\Plans\Models\PlanReviewEdition;
use Domain\Plans\Models\PlanReviewMember;
use Domain\Plans\Models\PlanReviewPhase;
use Domain\Plans\Policies\PlanPolicy;
use Spatie\LaravelData\Optional;

/**
 * Builds a plan's review for its reader in a bounded read: the actions its state and the caller's grants allow
 * (Edit to ask for and withdraw a review, Admin to decide), the edition asked for with its first phases and members
 * and their briefs cut short, the latest approval and the latest request for changes, and the comparison with the
 * edition before when there is one.
 */
final readonly class PlanReviewView
{
    public const int PHASES_SHOWN = 20;

    public const int MEMBERS_SHOWN = 20;

    public const int BRIEF_SHOWN = 400;

    public function __construct(
        private CurrentAuthorizer $authorizer,
        private PlanEditionComparison $comparison,
    ) {}

    public function of(string $planId): PlanReviewData
    {
        $plan = Plan::query()->whereKey($planId)->sole();
        $allowed = $this->authorizer->filterActions(PlanPolicy::class, $plan, [AccessType::Edit, AccessType::Admin]);
        $mayEdit = in_array(AccessType::Edit, $allowed, true);
        $requested = PlanReviewEdition::requestedOf($plan->id);
        $latest = PlanReviewEdition::latestOf($plan->id);
        $approval = PlanReviewEdition::latestApprovalOf($plan->id);

        return PlanReviewData::from([
            'mayRequest' => $mayEdit && $plan->state === PlanState::Planned,
            'mayWithdraw' => $mayEdit && $plan->state === PlanState::Reviewing,
            'mayDecide' => in_array(AccessType::Admin, $allowed, true) && $plan->state === PlanState::Reviewing,
            'mayCancel' => $mayEdit && ! in_array($plan->state, [PlanState::Done, PlanState::Cancelled], true),
            'mayFinish' => $mayEdit && $plan->state === PlanState::Started && $plan->progress->unfinished() === 0,
            'revision' => $plan->revision,
            'edition' => $requested === null ? Optional::create() : self::editionOf($requested),
            'receipt' => $approval === null ? Optional::create() : self::receiptOf($approval),
            'changesRequested' => $latest !== null && $latest->state === PlanReviewState::ChangesRequested
                ? self::receiptOf($latest)
                : Optional::create(),
            'changes' => $this->changesOf($latest),
        ]);
    }

    private function changesOf(PlanReviewEdition|null $latest): PlanEditionChangesData|Optional
    {
        $older = $latest === null || $latest->number === 1
            ? null
            : PlanReviewEdition::numberedIn($latest->plan_id, $latest->number - 1);

        if ($latest === null || $older === null) {
            return Optional::create();
        }

        return PlanEditionChangesData::ofChanges($older->number, $this->comparison->between($older, $latest));
    }

    private static function editionOf(PlanReviewEdition $edition): PlanReviewEditionData
    {
        $phases = PlanReviewPhase::pageOf($edition->id, 0, self::PHASES_SHOWN + 1);

        return new PlanReviewEditionData(
            $edition->number,
            $edition->fingerprint,
            $edition->title,
            $edition->brief,
            $edition->type->value,
            array_values($phases->take(self::PHASES_SHOWN)->map(
                fn (PlanReviewPhase $phase) => self::phaseOf($phase),
            )->all()),
            $phases->count() > self::PHASES_SHOWN,
        );
    }

    private static function phaseOf(PlanReviewPhase $phase): PlanReviewPhaseData
    {
        $members = PlanReviewMember::pageOf($phase->edition_id, $phase->position, 0, self::MEMBERS_SHOWN + 1);

        return new PlanReviewPhaseData(
            $phase->position,
            (string) $phase->phase_number,
            $phase->title,
            array_values($members->take(self::MEMBERS_SHOWN)->map(
                fn (PlanReviewMember $member) => new PlanReviewMemberData(
                    (string) $member->task_number,
                    $member->title,
                    mb_substr($member->brief, 0, self::BRIEF_SHOWN),
                    mb_strlen($member->brief) > self::BRIEF_SHOWN,
                ),
            )->all()),
            $members->count() > self::MEMBERS_SHOWN,
        );
    }

    private static function receiptOf(PlanReviewEdition $edition): PlanReviewReceiptData
    {
        return PlanReviewReceiptData::from(array_filter([
            'editionNumber' => $edition->number,
            'decidedByType' => $edition->decided_by_type,
            'decidedById' => $edition->decided_by_id,
            'decidedAt' => $edition->decided_at?->toIso8601String(),
            'isHistorical' => $edition->is_historical,
            'reason' => $edition->decision_reason,
        ], fn (mixed $receiptValue) => $receiptValue !== null));
    }
}
