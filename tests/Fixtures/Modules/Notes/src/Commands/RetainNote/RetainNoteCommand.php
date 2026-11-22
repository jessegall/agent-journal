<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands\RetainNote;

use App\Enums\AccessType;
use App\Attributes\Authorize;
use App\Attributes\RetainedActorRequestKey;
use App\Support\Command;
use Tests\Fixtures\Modules\Notes\Models\NotePage;
use Tests\Fixtures\Modules\Notes\Policies\NoteWorkPolicy;

/**
 * A write whose request key belongs to its actor across sessions: answered for 30 days, refused for good after.
 *
 * @extends Command<int>
 */
#[RetainedActorRequestKey]
#[Authorize(NoteWorkPolicy::class, AccessType::Edit)]
final readonly class RetainNoteCommand extends Command
{
    public function __construct(public string $text) {}
}
