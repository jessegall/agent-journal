<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Links;

use App\Support\ReadBuilder;
use App\Contracts\Records\RecordProvider;
use App\Data\RecordCard;
use App\Concerns\ProvidesModelRecords;
use Illuminate\Container\Attributes\Scoped;
use Illuminate\Database\Eloquent\Model;
use Tests\Fixtures\Modules\Notes\Models\NotePage;

/**
 * NotePages as records, named note-page 3: every actor reads them and nobody changes them.
 */
#[Scoped]
final readonly class NotePageLinkRecords implements RecordProvider
{
    /**
     * @use ProvidesModelRecords<NotePage>
     */
    use ProvidesModelRecords;

    public function referenceWord(): string
    {
        return 'note-page';
    }

    protected function linkType(): string
    {
        return NotePage::LINK_TYPE;
    }

    protected function readableRecords(): ReadBuilder
    {
        return NotePage::query();
    }

    protected function cardOf(Model $record): RecordCard
    {
        return RecordCard::from([
            'type' => NotePage::LINK_TYPE,
            'id' => $record->id,
            'number' => (string) $record->number,
            'label' => "note-page {$record->number}",
            'title' => 'NotePage',
            'abstract' => '',
            'route' => null,
        ]);
    }

    protected function mayChange(Model $record): bool
    {
        return false;
    }
}
