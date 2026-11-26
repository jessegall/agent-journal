<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Policies;

use App\Access\Contracts\Policy;
use Tests\Fixtures\Modules\Notes\Models\Note;

/**
 * Who may read or edit a note: the fixture module's own policy, registered through Core.
 */
final readonly class NotePolicy implements Policy
{
    public static function model(): string
    {
        return Note::class;
    }
}
