<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands\ClearNotes;

use App\Operations\Enums\AccessType;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use Tests\Fixtures\Modules\Notes\Models\NotePage;
use Tests\Fixtures\Modules\Notes\Policies\NoteWorkPolicy;

/**
 * @extends Command<null>
 */
#[Authorize(NoteWorkPolicy::class, AccessType::Delete)]
final readonly class ClearNotesCommand extends Command
{
    public function __construct() {}
}
