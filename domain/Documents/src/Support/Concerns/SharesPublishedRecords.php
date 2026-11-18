<?php

declare(strict_types=1);

namespace Domain\Documents\Support\Concerns;

use App\Records\Exceptions\RecordUnavailable;
use App\Records\Support\RecordIdentity;
use App\Sharing\Support\ShareBudget;
use App\Sharing\Support\ShareRecordCard;
use App\Sharing\Support\ShareRecords;
use App\Sharing\Support\ShareRelationRead;
use App\Sharing\Support\ShareSelection;
use App\Sharing\Support\ShareTargetRead;

/**
 * For the share provider of one Documents record type: the root's card for a preview and the cards of a batch of
 * linked targets, read only among the published records of that type; any other target is ineligible.
 */
trait SharesPublishedRecords
{
    /**
     * @throws RecordUnavailable when the root is missing or not published
     */
    public function preview(ShareSelection $selection, ShareBudget $budget): ShareRecordCard
    {
        return $this->publishedCards([$selection->root], $budget)[0] ?? throw RecordUnavailable::forActor($selection->root);
    }

    public function readTargets(ShareTargetRead $read, ShareBudget $budget): ShareRecords
    {
        $cards = $this->publishedCards($read->targets, $budget);
        $eligible = array_map(fn (ShareRecordCard $card) => $card->record, $cards);
        $ineligible = array_values(array_filter($read->targets, fn (RecordIdentity $target) => ! $this->isAmong($target, $eligible)));

        return new ShareRecords($cards, $ineligible, null);
    }

    public function readRelated(ShareRelationRead $read, ShareBudget $budget): ShareRecords
    {
        return new ShareRecords([], [], null);
    }

    /**
     * The cards of the published records among these, of this provider's type, charging their titles as metadata.
     *
     * @param  list<RecordIdentity>  $records
     * @return list<ShareRecordCard>
     */
    private function publishedCards(array $records, ShareBudget $budget): array
    {
        $ids = array_values(array_map(fn (RecordIdentity $record) => $record->id, array_filter($records, fn (RecordIdentity $record) => $record->type === $this->linkType())));
        $cards = $ids === [] ? [] : $this->cardsOf($ids);

        foreach ($cards as $card) {
            $budget->chargeMetadata(strlen($card->title));
        }

        return $cards;
    }

    /**
     * @param  list<RecordIdentity>  $records
     */
    private function isAmong(RecordIdentity $target, array $records): bool
    {
        foreach ($records as $record) {
            if ($record->isSameAs($target)) {
                return true;
            }
        }

        return false;
    }

    abstract private function linkType(): string;

    /**
     * @param  list<string>  $ids
     * @return list<ShareRecordCard>
     */
    abstract private function cardsOf(array $ids): array;
}
