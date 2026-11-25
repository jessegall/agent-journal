<?php

declare(strict_types=1);

namespace Domain\Documents\Support\Links;

use App\Concerns\ProvidesModelRecords;
use App\Contracts\Actors\CurrentActor;
use App\Contracts\Records\RecordProvider;
use App\Data\Pages\RecordCard;
use App\Support\ReadBuilder;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentRevision;
use Domain\Documents\Support\RecordChanges;
use Illuminate\Container\Attributes\Scoped;
use Illuminate\Database\Eloquent\Model;

/**
 * Documents as linkable records: published to every signed-in actor, and changed by a user or the agent that
 * created them, the same authority as settling.
 */
#[Scoped]
final readonly class DocumentLinkRecords implements RecordProvider
{
    /**
     * @use ProvidesModelRecords<Document>
     */
    use ProvidesModelRecords;

    public function __construct(private RecordChanges $changes, private CurrentActor $actors) {}

    public function referenceWord(): string
    {
        return 'doc';
    }

    protected function linkType(): string
    {
        return Document::linkType();
    }

    protected function readableRecords(): ReadBuilder
    {
        $this->actors->actor();

        return Document::query()->sharedPublished()->withCurrentRevisionCard();
    }

    protected function cardOf(Model $record): RecordCard
    {
        $revision = DocumentRevision::findCurrentOf($record);

        return RecordCard::from([
            'type' => Document::linkType(),
            'id' => $record->id,
            'number' => (string) $record->number,
            'label' => "doc {$record->number}",
            'title' => $revision->title,
            'abstract' => $revision->abstract,
            'route' => "/documents/docs/{$record->number}",
        ]);
    }

    protected function mayChange(Model $record): bool
    {
        return $this->changes->mayChange($record);
    }
}
