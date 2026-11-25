<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands\RecordNoteEffect;

use App\Enums\Agents\AccessType;
use App\Attributes\Commands\Authorize;
use App\Support\Command;
use Tests\Fixtures\Modules\Notes\Models\NotePage;
use Tests\Fixtures\Modules\Notes\Policies\NoteWorkPolicy;

/**
 * @extends Command<void>
 */
#[Authorize(NoteWorkPolicy::class, AccessType::Edit)]
final readonly class RecordNoteEffectCommand extends Command
{
    public function __construct(public string $label) {}
}
