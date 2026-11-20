<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands;

use App\Operations\Enums\AccessType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use Tests\Fixtures\Modules\Notes\Handlers\EngineNoteHandler;
use Tests\Fixtures\Modules\Notes\Models\NotePage;
use Tests\Fixtures\Modules\Notes\Policies\NoteWorkPolicy;

/**
 * @extends Command<int>
 */
#[HandledBy(EngineNoteHandler::class)]
#[Authorize(NoteWorkPolicy::class, AccessType::Edit)]
final readonly class EngineNote extends Command
{
    public function __construct(public string $text) {}
}
