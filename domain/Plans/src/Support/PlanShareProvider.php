<?php

declare(strict_types=1);

namespace Domain\Plans\Support;

use App\Contracts\Sharing\ShareBudget;
use App\Contracts\Sharing\ShareRecordProvider;
use App\Exceptions\RecordUnavailable;
use App\Support\RecordIdentity;
use App\Support\ShareContentRead;
use App\Support\SharedContent;
use App\Support\ShareRecordCard;
use App\Support\ShareRecords;
use App\Support\ShareRelationRead;
use App\Support\ShareSelection;
use App\Support\ShareTargetRead;
use App\Values\ProjectOwner;
use Domain\Plans\Models\Plan;

/**
 * Plans for a public share, as summary roots: the title and state only, never a phase or a task. The records linked
 * to a plan are read by their own providers, so Plans names none of their owners.
 */
final readonly class PlanShareProvider implements ShareRecordProvider
{
    private const array SUMMARY_COLUMNS = [
        'id',
        'title',
        'state',
    ];

    public function mayDisclose(RecordIdentity $record): bool
    {
        return $record->type === Plan::linkType() && Plan::query()->whereKey($record->id)->exists();
    }

    /**
     * @throws RecordUnavailable when the plan is missing
     */
    public function ownerOf(RecordIdentity $record): ProjectOwner
    {
        return Plan::query()
            ->whereKey($record->id)
            ->firstOr(RecordUnavailable::throwing()->forActor($record))
            ->projectOwner();
    }

    /**
     * @throws RecordUnavailable when the plan is missing
     */
    public function preview(ShareSelection $selection, ShareBudget $budget): ShareRecordCard
    {
        return $this->summaryOf($selection->root, $budget)->shareCard;
    }

    public function readTargets(ShareTargetRead $read, ShareBudget $budget): ShareRecords
    {
        $ids = array_values(
            array_map(
                fn (RecordIdentity $target) => $target->id,
                array_filter($read->targets, fn (RecordIdentity $target) => $target->type === Plan::linkType()),
            ),
        );

        $cards = array_values(
            Plan::query()->whereKey($ids)->readExactly(count($ids))->get(self::SUMMARY_COLUMNS)->map(
                fn (Plan $plan) => $plan->share_card,
            )->all(),
        );

        $publishedPlanIds = array_map(fn (ShareRecordCard $card) => $card->record->id, $cards);

        foreach ($cards as $card) {
            $budget->chargeMetadata(strlen($card->title));
        }

        return new ShareRecords(
            $cards,
            array_values(
                array_filter(
                    $read->targets,
                    fn (RecordIdentity $target) => ! in_array($target->id, $publishedPlanIds, true),
                ),
            ),
            null,
        );
    }

    public function readRelated(ShareRelationRead $read, ShareBudget $budget): ShareRecords
    {
        return new ShareRecords([], [], null);
    }

    /**
     * @throws RecordUnavailable when the plan is missing
     */
    public function content(ShareContentRead $read, ShareBudget $budget): SharedContent
    {
        $plan = $this->summaryOf($read->record, $budget);
        $summary = $plan->shareSummary;
        $budget->chargeText(strlen($summary));

        return new SharedContent($plan->shareCard, $summary);
    }

    /**
     * @throws RecordUnavailable
     */
    private function summaryOf(RecordIdentity $record, ShareBudget $budget): Plan
    {
        if ($record->type !== Plan::linkType()) {
            throw RecordUnavailable::forActor($record);
        }

        $plan = Plan::query()->whereKey($record->id)->firstOr(RecordUnavailable::throwing()->forActor($record));
        $budget->chargeMetadata(strlen($plan->title));

        return $plan;
    }
}
