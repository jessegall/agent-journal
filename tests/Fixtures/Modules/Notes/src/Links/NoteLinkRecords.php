<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Links;

use App\Actors\Contracts\CurrentActor;
use App\Reads\Support\ReadBuilder;
use App\Records\Contracts\RecordProvider;
use App\Records\Data\RecordCard;
use App\Records\Support\ProvidesModelRecords;
use Illuminate\Container\Attributes\Scoped;
use Illuminate\Database\Eloquent\Model;
use Tests\Fixtures\Modules\Notes\Models\Note;

/**
 * Notes as records, named note 3: a user reads every note, an agent only its own, and only the writer changes one.
 */
#[Scoped]
final readonly class NoteLinkRecords implements RecordProvider
{
    /**
     * @use ProvidesModelRecords<Note>
     */
    use ProvidesModelRecords;

    public function __construct(private CurrentActor $actors) {}

    public function referenceWord(): string
    {
        return 'note';
    }

    protected function linkType(): string
    {
        return Note::LINK_TYPE;
    }

    protected function readableRecords(): ReadBuilder
    {
        return Note::query()->forActor();
    }

    protected function cardOf(Model $record): RecordCard
    {
        return RecordCard::from([
            'type' => Note::LINK_TYPE,
            'id' => $record->id,
            'number' => (string) $record->number,
            'label' => "note {$record->number}",
            'title' => $record->text,
            'abstract' => '',
            'route' => null,
        ]);
    }

    protected function mayChange(Model $record): bool
    {
        return $record->actor_type === $this->actors->actor()->actorType()->value && $record->actor_id === $this->actors->actor()->actorId();
    }
}
