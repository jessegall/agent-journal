<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands\WriteNote;

use App\Operations\Enums\AccessType;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use Tests\Fixtures\Modules\Notes\Models\NotePage;
use Tests\Fixtures\Modules\Notes\Policies\NoteWorkPolicy;

/**
 * @extends Command<int>
 */
#[Authorize(NoteWorkPolicy::class, AccessType::Create)]
final readonly class WriteNoteCommand extends Command
{
    public function __construct(public string $text) {}
}
