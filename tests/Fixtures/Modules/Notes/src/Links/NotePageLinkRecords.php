<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Links;

use App\Data\Pages\RecordCard;
use App\Links\Concerns\ProvidesModelRecords;
use App\Records\Contracts\RecordProvider;
use App\Support\BoundedReadBuilder;
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
        return NotePage::linkType();
    }

    protected function readableRecords(): BoundedReadBuilder
    {
        return NotePage::query();
    }

    protected function cardOf(Model $record): RecordCard
    {
        return RecordCard::from([
            'type' => NotePage::linkType(),
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
