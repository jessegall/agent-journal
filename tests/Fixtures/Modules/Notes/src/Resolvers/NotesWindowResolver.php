<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Resolvers;

use App\Navigation\Contracts\PageResolver;
use Tests\Fixtures\Modules\Notes\Data\NotesPageData;
use Tests\Fixtures\Modules\Notes\Models\Note;

/**
 * The notes window: every note the calling actor may see, newest first.
 */
final readonly class NotesWindowResolver implements PageResolver
{
    public function read(): NotesPageData
    {
        return NotesPageData::from(
            ['texts' => array_values(Note::query()->forActor()->latest('id')->pluck('text')->all())],
        );
    }
}
