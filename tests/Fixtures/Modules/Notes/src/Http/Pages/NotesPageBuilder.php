<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Http\Pages;

use App\Web\Creation\Contracts\PageBuilder;
use Illuminate\Http\Request;
use Tests\Fixtures\Modules\Notes\Data\NotesPageData;
use Tests\Fixtures\Modules\Notes\Models\Note;

/**
 * The notes window: every note the calling actor may see, newest first.
 */
final readonly class NotesPageBuilder implements PageBuilder
{
    public function build(Request $visit): NotesPageData
    {
        $texts = Note::query()->forActor()->latest('id')->pluck('text')->values()->all();

        return NotesPageData::build()->texts($texts)->finish();
    }
}
