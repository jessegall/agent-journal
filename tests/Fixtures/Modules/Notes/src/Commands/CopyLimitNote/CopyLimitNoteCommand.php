<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands\CopyLimitNote;

use App\Operations\Enums\AccessType;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use Tests\Fixtures\Modules\Notes\Models\NotePage;
use Tests\Fixtures\Modules\Notes\Policies\NoteWorkPolicy;

/**
 * Writes its text through a nested LimitNote, so the nested command's limit decides.
 *
 * @extends Command<int>
 */
#[Authorize(NoteWorkPolicy::class, AccessType::Create)]
final readonly class CopyLimitNoteCommand extends Command
{
    public function __construct(public string $text) {}
}
