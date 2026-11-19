<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use Tests\Fixtures\Modules\Notes\Enums\NoteWorkAbility;
use Tests\Fixtures\Modules\Notes\Handlers\RetainNoteHandler;
use Tests\Fixtures\Modules\Notes\Models\NotePage;
use Tests\Fixtures\Modules\Notes\Policies\NoteWorkPolicy;

/**
 * A write whose request key belongs to its actor across sessions: answered for 30 days, refused for good after.
 *
 * @extends Command<int>
 */
#[HandledBy(RetainNoteHandler::class)]
#[Authorize(NoteWorkPolicy::class, NoteWorkAbility::Work)]
#[RetainedActorRequestKey]
final readonly class RetainNote extends Command implements HasAuthorizationSubject
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
