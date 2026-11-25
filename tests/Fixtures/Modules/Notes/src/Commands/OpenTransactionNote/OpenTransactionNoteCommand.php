<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands\OpenTransactionNote;

use App\Enums\Agents\AccessType;
use App\Attributes\Authorize;
use App\Support\Command;
use Tests\Fixtures\Modules\Notes\Models\NotePage;
use Tests\Fixtures\Modules\Notes\Policies\NoteWorkPolicy;

/**
 * @extends Command<int>
 */
#[Authorize(NoteWorkPolicy::class, AccessType::Create)]
final readonly class OpenTransactionNoteCommand extends Command
{
    public function __construct(public string $text) {}
}
