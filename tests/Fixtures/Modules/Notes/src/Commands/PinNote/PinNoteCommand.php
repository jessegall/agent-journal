<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands\PinNote;

use App\Operations\Enums\AccessType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Support\Command;
use Tests\Fixtures\Modules\Notes\Models\NotePage;
use Tests\Fixtures\Modules\Notes\Policies\NoteWorkPolicy;

/**
 * @extends Command<string>
 */
#[RepeatableRead]
#[Authorize(NoteWorkPolicy::class, AccessType::Edit)]
final readonly class PinNoteCommand extends Command
{
    public function __construct(public int $rowId) {}
}
