<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Links;

use App\Concerns\ProvidesModelRecords;
use App\Contracts\Actors\CurrentActor;
use App\Contracts\Records\RecordProvider;
use App\Data\Pages\RecordCard;
use App\Support\ReadBuilder;
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
        return Note::linkType();
    }

    protected function readableRecords(): ReadBuilder
    {
        return Note::query()->forActor();
    }

    protected function cardOf(Model $record): RecordCard
    {
        return RecordCard::from([
            'type' => Note::linkType(),
            'id' => $record->id,
            'number' => (string) $record->number,
            'label' => "note {$record->number}",
            'title' => $record->text,
            'abstract' => '',
            'route' => null,
        ]);
    }

    /**
     * @param  Note  $record
     */
    protected function mayChange(Model $record): bool
    {
        return $record->isWrittenBy($this->actors->actor());
    }
}
