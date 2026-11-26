<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands\IgnoreFailedNote;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Support\Command;
use Tests\Fixtures\Modules\Notes\Policies\NoteWorkPolicy;

/**
 * @extends Command<int>
 */
#[Authorize(NoteWorkPolicy::class, AccessType::Edit)]
final readonly class IgnoreFailedNoteCommand extends Command
{
    public function __construct(public string $text) {}
}
