<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use App\Contracts\Records\PublicCommentResolver;
use App\Contracts\Sharing\ShareBudget;
use App\Contracts\Sharing\ShareRecordProvider;
use App\Exceptions\ContentTooLarge;
use App\Exceptions\RecordUnavailable;
use App\Support\MarkdownText;
use App\Support\ReadBuilder;
use App\Support\RecordIdentity;
use App\Support\ShareContentRead;
use App\Support\SharedContent;
use Domain\Documents\Concerns\SharesPublishedRecords;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentRevision;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Documents for a public share: a document discloses only its last closed revision, never a draft, and its body is
 * measured in the database before it is loaded.
 */
final readonly class DocumentShareProvider implements ShareRecordProvider
{
    use SharesPublishedRecords;

    public function __construct(private PublicCommentResolver $comments) {}

    public function mayDisclose(RecordIdentity $record): bool
    {
        return $record->type === Document::LINK_TYPE && Document::query()->sharedPublished()->whereKey(
            $record->id,
        )->exists();
    }

    /**
     * @throws RecordUnavailable
     * @throws ContentTooLarge when the stored body is larger than a body may be
     */
    public function content(ShareContentRead $read, ShareBudget $budget): SharedContent
    {
        $document = $this->cardQuery([$read->record->id])->firstOr(
            fn () => throw RecordUnavailable::forActor($read->record),
        );

        $revisionId = (string) $document->current_revision_id;
        $bytes = DocumentRevision::bodyBytesOf($revisionId);

        if ($bytes > MarkdownText::BODY_BYTES) {
            throw ContentTooLarge::field("body of doc {$document->number}", '1 MiB');
        }

        $budget->chargeText($bytes);

        return new SharedContent(
            $document->shareCard(),
            (string) DocumentRevision::query()->whereKey($revisionId)->value('body'),
        );
    }

    private function linkType(): string
    {
        return Document::LINK_TYPE;
    }

    private function cardsOf(array $ids): array
    {
        return array_values(
            $this->cardQuery($ids)->get()->map(fn (Document $document) => $document->shareCard())->all(),
        );
    }

    /**
     * The published documents of these ids with the card columns of their current closed revision.
     *
     * @param  list<string>  $ids
     * @return ReadBuilder<Document>
     */
    private function cardQuery(array $ids): ReadBuilder
    {
        return Document::query()->sharedPublished()->with(
            ['currentRevision' => fn (BelongsTo $revision) => $revision->forCards()],
        )->whereKey($ids)->readExactly(count($ids));
    }
}
