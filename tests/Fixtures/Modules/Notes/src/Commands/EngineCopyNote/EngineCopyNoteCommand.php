<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands\EngineCopyNote;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Support\Command;
use Tests\Fixtures\Modules\Notes\Policies\NoteWorkPolicy;

/**
 * An engine command that runs WriteNote, which does not allow the engine, as a nested command.
 *
 * @extends Command<int>
 */
#[Authorize(NoteWorkPolicy::class, AccessType::Edit)]
final readonly class EngineCopyNoteCommand extends Command
{
    public function __construct(public string $text) {}
}
