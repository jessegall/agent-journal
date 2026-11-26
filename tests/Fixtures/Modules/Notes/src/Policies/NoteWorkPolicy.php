<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Policies;

use App\Access\Contracts\Policy;
use Tests\Fixtures\Modules\Notes\Models\NotePage;

/**
 * Who may run the notes commands: every granted actor, so the grants decide.
 */
final readonly class NoteWorkPolicy implements Policy
{
    public static function model(): string
    {
        return NotePage::class;
    }
}
