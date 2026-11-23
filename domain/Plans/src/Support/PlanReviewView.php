<?php

declare(strict_types=1);

namespace Domain\Plans\Support;

use App\Contracts\Assignments\AssigneeResolver;
use App\Contracts\Authorization\CurrentAuthorizer;
use App\Enums\AccessType;
use App\Support\AssigneeName;
use App\Support\AssignmentGroup;
use App\Support\Page;
use Domain\Plans\Data\PlanReviewData;
use Domain\Plans\Data\PlanReviewReceiptData;
use Domain\Plans\Data\PlanWorkPreviewData;
use Domain\Plans\Data\PlanWorkRecipientData;
use Domain\Plans\Enums\PlanReviewState;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Models\Plan;
use Domain\Plans\Models\PlanReviewEdition;
use Domain\Plans\Policies\PlanPolicy;
use Spatie\LaravelData\Optional;

/**
 * Builds a plan's review for its reader in a bounded read: the actions its state and the caller's grants allow
 * (Edit to ask for and withdraw a review, Admin to decide), the number of the review asked for, the latest approval
 * and the latest request for changes. The plan itself is read live: it cannot change while it is under review.
 */
final readonly class PlanReviewView
{
    public const int RECIPIENTS_SHOWN = 20;

    public function __construct(
        private CurrentAuthorizer $authorizer,
        private AssigneeResolver $assignees,
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
            'mayCancel' => $mayEdit && ! $plan->state->hasEnded(),
            'mayFinish' => $mayEdit && $plan->state === PlanState::Started && $plan->progress->unfinished() === 0,
            'revision' => $plan->revision,
            'work' => $this->workOf($plan, $mayEdit),
            'reviewNumber' => $requested?->number,
            'receipt' => self::receiptOrMissing($approval),
            'changesRequested' => $latest !== null && $latest->state === PlanReviewState::ChangesRequested
                ? self::receiptOf($latest)
                : Optional::create(),
        ]);
    }

    /**
     * What assigning the plan's work would move, from its tallies and one count of its phases, and the first eligible
     * workers; a plan over the one limit can be previewed but not assigned.
     */
    private function workOf(Plan $plan, bool $mayEdit): PlanWorkPreviewData
    {
        $phaseCount = $plan->phases()->count();
        $progress = $plan->progress;

        return PlanWorkPreviewData::from([
            'mayAssign' => $mayEdit && ! $plan->state->hasEnded(),
            'phaseCount' => $phaseCount,
            'taskCount' => $progress->total,
            'movingTasks' => $progress->unfinished(),
            'stayingTasks' => $progress->finished + $progress->cancelled,
            'isOverLimit' => 1 + $phaseCount + $progress->total > AssignmentGroup::LARGEST,
            'recipients' => array_map(
                fn (AssigneeName $name) => PlanWorkRecipientData::ofName($name),
                $this->assignees->eligible('agent', new Page(null, self::RECIPIENTS_SHOWN))->assignees,
            ),
        ]);
    }

    private static function receiptOrMissing(PlanReviewEdition|null $edition): PlanReviewReceiptData|Optional
    {
        return $edition === null ? Optional::create() : self::receiptOf($edition);
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
