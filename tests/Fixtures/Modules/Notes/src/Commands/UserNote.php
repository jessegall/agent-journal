<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use Tests\Fixtures\Modules\Notes\Enums\NoteWorkAbility;
use Tests\Fixtures\Modules\Notes\Handlers\UserNoteHandler;
use Tests\Fixtures\Modules\Notes\Models\NotePage;
use Tests\Fixtures\Modules\Notes\Policies\NoteWorkPolicy;

/**
 * @extends Command<int>
 */
#[HandledBy(UserNoteHandler::class)]
#[Authorize(NoteWorkPolicy::class, NoteWorkAbility::Work)]
#[Operation('user_note', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class UserNote extends Command implements AuthorizedCommand
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
