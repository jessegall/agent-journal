<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresRequestKey;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use Tests\Fixtures\Modules\Notes\Enums\NoteWorkAbility;
use Tests\Fixtures\Modules\Notes\Handlers\KeepNoteHandler;
use Tests\Fixtures\Modules\Notes\Models\NotePage;
use Tests\Fixtures\Modules\Notes\Policies\NoteWorkPolicy;

/**
 * A write that runs only under a request key, its receipt kept 31 days and its key refused until 365.
 *
 * @extends Command<int>
 */
#[HandledBy(KeepNoteHandler::class)]
#[Authorize(NoteWorkPolicy::class, NoteWorkAbility::Work)]
#[RequiresRequestKey(retentionDays: 31, tombstoneDays: 365)]
#[Operation('keep_note', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class KeepNote extends Command implements HasAuthorizationSubject
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
