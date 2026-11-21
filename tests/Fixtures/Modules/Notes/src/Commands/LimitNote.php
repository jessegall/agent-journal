<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands;

use App\Operations\Enums\AccessType;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use Spatie\LaravelData\Attributes\Validation\Max;
use Tests\Fixtures\Modules\Notes\Models\NotePage;
use Tests\Fixtures\Modules\Notes\Policies\NoteWorkPolicy;

/**
 * A note of at most five characters, with an optional label of at most five.
 *
 * @extends Command<int>
 */
#[Authorize(NoteWorkPolicy::class, AccessType::Edit)]
final readonly class LimitNote extends Command
{
    public function __construct(
        #[Max(5)]
        public string $text,
        #[Max(5)]
        public string|null $label = null,
    ) {}
}
