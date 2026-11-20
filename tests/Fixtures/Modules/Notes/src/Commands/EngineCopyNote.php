<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use Tests\Fixtures\Modules\Notes\Enums\NoteWorkAbility;
use Tests\Fixtures\Modules\Notes\Handlers\EngineCopyNoteHandler;
use Tests\Fixtures\Modules\Notes\Models\NotePage;
use Tests\Fixtures\Modules\Notes\Policies\NoteWorkPolicy;

/**
 * An engine command that runs WriteNote, which does not allow the engine, as a nested command.
 *
 * @extends Command<int>
 */
#[HandledBy(EngineCopyNoteHandler::class)]
#[Operation('engine_copy_note', ResourceAreaType::JournalWork, AccessType::Edit)]
#[Authorize(NoteWorkPolicy::class, NoteWorkAbility::Work)]
final readonly class EngineCopyNote extends Command implements HasAuthorizationSubject
{
    public function __construct(public string $text) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return NotePage::class;
    }
}
