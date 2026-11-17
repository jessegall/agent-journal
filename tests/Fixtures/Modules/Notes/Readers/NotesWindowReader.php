<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Readers;

use App\Core\Ui\Contracts\PageReader;
use Tests\Fixtures\Modules\Notes\Data\NotesPageData;
use Tests\Fixtures\Modules\Notes\Models\Note;

/**
 * The notes window: every note the calling actor may see, newest first.
 */
final readonly class NotesWindowReader implements PageReader
{
    public function read(): NotesPageData
    {
        return NotesPageData::from(['texts' => array_values(Note::query()->forActor()->latest('id')->pluck('text')->all())]);
    }
}
