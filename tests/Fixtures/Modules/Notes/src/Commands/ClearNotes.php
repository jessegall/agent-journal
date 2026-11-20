<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands;

use App\Operations\Enums\AccessType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use Tests\Fixtures\Modules\Notes\Handlers\ClearNotesHandler;
use Tests\Fixtures\Modules\Notes\Models\NotePage;
use Tests\Fixtures\Modules\Notes\Policies\NoteWorkPolicy;

/**
 * @extends Command<null>
 */
#[HandledBy(ClearNotesHandler::class)]
#[Authorize(NoteWorkPolicy::class, AccessType::Delete)]
final readonly class ClearNotes extends Command
{
    public function __construct() {}
}
