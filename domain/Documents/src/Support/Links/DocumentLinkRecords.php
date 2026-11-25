<?php

declare(strict_types=1);

namespace Domain\Documents\Support\Links;

use App\Concerns\ProvidesModelRecords;
use App\Contracts\Actors\CurrentActor;
use App\Contracts\Records\RecordProvider;
use App\Data\Pages\RecordCard;
use App\Support\ReadBuilder;
use Domain\Documents\Models\Document;
use Domain\Documents\Support\RecordChanges;
use Illuminate\Container\Attributes\Scoped;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
        return Document::LINK_TYPE;
    }

    protected function readableRecords(): ReadBuilder
    {
        $this->actors->actor();

        return Document::query()->sharedPublished()->with(
            ['currentRevision' => fn (BelongsTo $revision) => $revision->forCards()],
        );
    }

    protected function cardOf(Model $record): RecordCard
    {
        return RecordCard::from([
            'type' => Document::LINK_TYPE,
            'id' => $record->id,
            'number' => (string) $record->number,
            'label' => "doc {$record->number}",
            'title' => $record->currentRevisionOrFail()->title,
            'abstract' => $record->currentRevisionOrFail()->abstract,
            'route' => "/documents/docs/{$record->number}",
        ]);
    }

    protected function mayChange(Model $record): bool
    {
        return $this->changes->mayChange($record);
    }
}
