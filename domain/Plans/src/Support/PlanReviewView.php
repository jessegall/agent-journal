<?php

declare(strict_types=1);

namespace Domain\Plans\Support;

use App\Access\Contracts\CurrentAuthorizer;
use App\Agents\Enums\AccessType;
use App\Assignments\AssignmentGroup;
use App\Assignments\Contracts\AssigneeResolver;
use App\Support\AssigneeName;
use App\Support\IdListPage;
use Domain\Plans\Data\PlanReviewData;
use Domain\Plans\Data\PlanReviewReceiptData;
use Domain\Plans\Data\PlanWorkPreviewData;
use Domain\Plans\Data\PlanWorkRecipientData;
use Domain\Plans\Enums\PlanReviewStatus;
use Domain\Plans\Enums\PlanStatus;
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
        $requested = PlanReviewEdition::findRequestedOf($plan->id);
        $latest = PlanReviewEdition::findLatestOf($plan->id);
        $approval = PlanReviewEdition::findLatestApprovalOf($plan->id);

        return PlanReviewData::from([
            'mayRequest' => $mayEdit && $plan->status === PlanStatus::Planned,
            'mayWithdraw' => $mayEdit && $plan->status === PlanStatus::Reviewing,
            'mayDecide' => in_array(AccessType::Admin, $allowed, true) && $plan->status === PlanStatus::Reviewing,
            'mayCancel' => $mayEdit && ! $plan->status->hasEnded(),
            'mayFinish' => $mayEdit && $plan->status === PlanStatus::Started && $plan->progress->unfinished() === 0,
            'revision' => $plan->revision,
            'work' => $this->workOf($plan, $mayEdit),
            'reviewNumber' => $requested?->number,
            'receipt' => self::receiptOrMissing($approval),
            'changesRequested' => $latest !== null && $latest->status === PlanReviewStatus::ChangesRequested
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
            'mayAssign' => $mayEdit && ! $plan->status->hasEnded(),
            'phaseCount' => $phaseCount,
            'taskCount' => $progress->total,
            'movingTasks' => $progress->unfinished(),
            'stayingTasks' => $progress->finished + $progress->cancelled,
            'isOverLimit' => 1 + $phaseCount + $progress->total > AssignmentGroup::LARGEST,
            'recipients' => array_map(
                fn (AssigneeName $name) => PlanWorkRecipientData::ofName($name),
                $this->assignees->eligible('agent', new IdListPage(null, self::RECIPIENTS_SHOWN))->assignees,
            ),
        ]);
    }

    private static function receiptOrMissing(PlanReviewEdition|null $edition): PlanReviewReceiptData|Optional
    {
        if ($edition === null) {
            return Optional::create();
        }

        return self::receiptOf($edition);
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
