<?php

declare(strict_types=1);

namespace Domain\Documents\Links;

use App\Actors\Contracts\CurrentActor;
use App\Reads\Support\ReadBuilder;
use App\Records\Contracts\RecordProvider;
use App\Records\Data\RecordCard;
use App\Records\Support\ProvidesModelRecords;
use Domain\Documents\Models\Document;
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

    public function __construct(private CurrentActor $actors) {}

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

        return Document::query()->sharedPublished()->with('currentRevision');
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
        return $record->allowsChangesBy($this->actors->actor());
    }
}
