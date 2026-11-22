<?php

declare(strict_types=1);

namespace Domain\Documents\Concerns;

use App\Contracts\Sharing\ShareBudget;
use App\Exceptions\RecordUnavailable;
use App\Support\PublicComment;
use App\Support\RecordIdentity;
use App\Support\ShareContentRead;
use App\Support\ShareRecordCard;
use App\Support\ShareRecords;
use App\Support\ShareRelationRead;
use App\Support\ShareSelection;
use App\Support\ShareTargetRead;
use Domain\Documents\Models\Document;

/**
 * For the share provider of one Documents record type: the root's card for a preview, the cards of a batch of
 * linked targets, read only among the published records of that type, and the parent's live comments a page at a
 * time; any other target is ineligible.
 */
trait SharesPublishedRecords
{
    /**
     * @throws RecordUnavailable when the root is missing or not published
     */
    public function preview(ShareSelection $selection, ShareBudget $budget): ShareRecordCard
    {
        return $this->publishedCards(
            [$selection->root],
            $budget,
        )[0] ?? throw RecordUnavailable::forActor($selection->root);
    }

    public function readTargets(ShareTargetRead $read, ShareBudget $budget): ShareRecords
    {
        $cards = $this->publishedCards($read->targets, $budget);
        $eligible = array_map(fn (ShareRecordCard $card) => $card->record, $cards);

        $ineligible = array_values(
            array_filter($read->targets, fn (RecordIdentity $target) => ! $this->isAmong($target, $eligible)),
        );

        return new ShareRecords($cards, $ineligible, null);
    }

    /**
     * A page of the parent's comments, live: an excerpt of each, and its quote only while the exact quoted text is
     * still in the parent's published body.
     */
    public function readRelated(ShareRelationRead $read, ShareBudget $budget): ShareRecords
    {
        if ($read->relation !== Document::SHARED_COMMENTS) {
            return new ShareRecords([], [], null);
        }

        $page = $this->comments->pageOf($read->parent, $read->limit, $read->continuation);
        $quoted = array_filter($page->comments, fn (PublicComment $comment) => $comment->quote !== null);
        $body = $quoted === [] ? '' : $this->content(new ShareContentRead($read->parent), $budget)->body;
        $cards = [];

        foreach ($page->comments as $comment) {
            $budget->chargeMetadata(strlen($comment->excerpt));

            $cards[] = new ShareRecordCard(
                $comment->comment,
                "Comment of {$comment->writtenAt}",
                '1',
                $comment->excerpt,
                self::quoteIn($body, $comment->quote),
            );
        }

        return new ShareRecords($cards, [], $page->next);
    }

    /**
     * The cards of the published records among these, of this provider's type, charging their titles as metadata.
     *
     * @param  list<RecordIdentity>  $records
     * @return list<ShareRecordCard>
     */
    private function publishedCards(array $records, ShareBudget $budget): array
    {
        $ids = array_values(
            array_map(
                fn (RecordIdentity $record) => $record->id,
                array_filter($records, fn (RecordIdentity $record) => $record->type === $this->linkType()),
            ),
        );

        $cards = $ids === [] ? [] : $this->cardsOf($ids);

        foreach ($cards as $card) {
            $budget->chargeMetadata(strlen($card->title));
        }

        return $cards;
    }

    /**
     * The quote while its exact text is in the body, the fixed label once it is not, none for a whole-record comment.
     */
    private static function quoteIn(string $body, string|null $quote): string|null
    {
        if ($quote === null) {
            return null;
        }

        return str_contains($body, $quote) ? $quote : ShareRecordCard::QUOTE_NOT_IN_VERSION;
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
