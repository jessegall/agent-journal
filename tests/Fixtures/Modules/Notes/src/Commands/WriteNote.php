<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands;

use App\Operations\Enums\AccessType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use Tests\Fixtures\Modules\Notes\Handlers\WriteNoteHandler;
use Tests\Fixtures\Modules\Notes\Models\NotePage;
use Tests\Fixtures\Modules\Notes\Policies\NoteWorkPolicy;

/**
 * @extends Command<int>
 */
#[HandledBy(WriteNoteHandler::class)]
#[Authorize(NoteWorkPolicy::class, AccessType::Create)]
final readonly class WriteNote extends Command
{
    public function __construct(public string $text) {}
}
