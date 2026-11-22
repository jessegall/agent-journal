<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands\AuditNote;

use App\Attributes\Authorize;
use App\Support\Command;
use App\Enums\AccessType;
use Tests\Fixtures\Modules\Notes\Policies\NoteWorkPolicy;

/**
 * Writes a note and dispatches its audit with a plain dispatch from the handler, then fails when asked to.
 *
 * @extends Command<int>
 */
#[Authorize(NoteWorkPolicy::class, AccessType::Create)]
final readonly class AuditNoteCommand extends Command
{
    public function __construct(public string $text, public bool $fails = false) {}
}
