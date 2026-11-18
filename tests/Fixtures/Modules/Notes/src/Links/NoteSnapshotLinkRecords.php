<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Links;

use App\Reads\Support\ReadBuilder;
use App\Records\Contracts\RecordProvider;
use App\Records\Data\RecordCard;
use App\Records\Support\ProvidesModelRecords;
use Illuminate\Container\Attributes\Scoped;
use Illuminate\Database\Eloquent\Model;
use Tests\Fixtures\Modules\Notes\Models\NoteSnapshot;

/**
 * NoteSnapshots as records, named note-snapshot 3: every actor reads them and nobody changes them.
 */
#[Scoped]
final readonly class NoteSnapshotLinkRecords implements RecordProvider
{
    /**
     * @use ProvidesModelRecords<NoteSnapshot>
     */
    use ProvidesModelRecords;

    public function referenceWord(): string
    {
        return 'note-snapshot';
    }

    protected function linkType(): string
    {
        return NoteSnapshot::LINK_TYPE;
    }

    protected function readableRecords(): ReadBuilder
    {
        return NoteSnapshot::query();
    }

    protected function cardOf(Model $record): RecordCard
    {
        return RecordCard::from([
            'type' => NoteSnapshot::LINK_TYPE,
            'id' => $record->id,
            'number' => (string) $record->number,
            'label' => "note-snapshot {$record->number}",
            'title' => 'NoteSnapshot',
            'abstract' => '',
            'route' => null,
        ]);
    }

    protected function mayChange(Model $record): bool
    {
        return false;
    }
}
