<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands\KeepNote;

use App\Enums\AccessType;
use App\Attributes\Authorize;
use App\Attributes\RequiresRequestKey;
use App\Support\Command;
use Tests\Fixtures\Modules\Notes\Models\NotePage;
use Tests\Fixtures\Modules\Notes\Policies\NoteWorkPolicy;

/**
 * A write that runs only under a request key, its receipt kept 31 days and its key refused until 365.
 *
 * @extends Command<int>
 */
#[Authorize(NoteWorkPolicy::class, AccessType::Edit)]
#[RequiresRequestKey(retentionDays: 31, tombstoneDays: 365)]
final readonly class KeepNoteCommand extends Command
{
    public function __construct(public string $text) {}
}
