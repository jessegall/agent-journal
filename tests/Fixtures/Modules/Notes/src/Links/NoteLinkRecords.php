<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Links;

use App\Contracts\CurrentActor;
use App\Support\ActorIdentity;
use App\Support\ReadBuilder;
use App\Contracts\RecordProvider;
use App\Data\RecordCard;
use App\Concerns\ProvidesModelRecords;
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

    /**
     * @param  Note  $record
     */
    protected function mayChange(Model $record): bool
    {
        return $record->isWrittenBy(ActorIdentity::of($this->actors->actor()));
    }
}
