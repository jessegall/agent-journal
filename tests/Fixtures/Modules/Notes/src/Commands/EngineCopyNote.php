<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands;

use App\Operations\Enums\AccessType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use Tests\Fixtures\Modules\Notes\Handlers\EngineCopyNoteHandler;
use Tests\Fixtures\Modules\Notes\Models\NotePage;
use Tests\Fixtures\Modules\Notes\Policies\NoteWorkPolicy;

/**
 * An engine command that runs WriteNote, which does not allow the engine, as a nested command.
 *
 * @extends Command<int>
 */
#[HandledBy(EngineCopyNoteHandler::class)]
#[Authorize(NoteWorkPolicy::class, AccessType::Edit)]
final readonly class EngineCopyNote extends Command
{
    public function __construct(public string $text) {}
}
