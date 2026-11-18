<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Contracts;

use Tests\Fixtures\Modules\Notes\Api\NoteValue;

/**
 * Reads one note of the module by its id.
 */
interface NoteReader
{
    public function note(string $noteId): NoteValue;
}
