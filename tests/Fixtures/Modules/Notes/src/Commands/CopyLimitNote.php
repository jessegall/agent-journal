<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use Tests\Fixtures\Modules\Notes\Enums\NoteWorkAbility;
use Tests\Fixtures\Modules\Notes\Handlers\CopyLimitNoteHandler;
use Tests\Fixtures\Modules\Notes\Models\NotePage;
use Tests\Fixtures\Modules\Notes\Policies\NoteWorkPolicy;

/**
 * Writes its text through a nested LimitNote, so the nested command's limit decides.
 *
 * @implements Command<int>
 */
#[HandledBy(CopyLimitNoteHandler::class)]
#[Authorize(NoteWorkPolicy::class, NoteWorkAbility::Work)]
final readonly class CopyLimitNote implements Command, HasAuthorizationSubject
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
