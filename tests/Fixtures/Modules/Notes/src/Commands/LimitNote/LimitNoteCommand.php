<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands\LimitNote;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Support\Command;
use Spatie\LaravelData\Attributes\Validation\Max;
use Tests\Fixtures\Modules\Notes\Policies\NoteWorkPolicy;

/**
 * A note of at most five characters, with an optional label of at most five.
 *
 * @extends Command<int>
 */
#[Authorize(NoteWorkPolicy::class, AccessType::Edit)]
final readonly class LimitNoteCommand extends Command
{
    public function __construct(
        #[Max(5)]
        public string $text,
        #[Max(5)]
        public string|null $label = null,
    ) {}
}
