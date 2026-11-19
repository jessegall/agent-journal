<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use Spatie\LaravelData\Attributes\Validation\Max;
use Tests\Fixtures\Modules\Notes\Enums\NoteWorkAbility;
use Tests\Fixtures\Modules\Notes\Handlers\LimitNoteHandler;
use Tests\Fixtures\Modules\Notes\Models\NotePage;
use Tests\Fixtures\Modules\Notes\Policies\NoteWorkPolicy;

/**
 * A note of at most five characters, with an optional label of at most five.
 *
 * @extends Command<int>
 */
#[HandledBy(LimitNoteHandler::class)]
#[Authorize(NoteWorkPolicy::class, NoteWorkAbility::Work)]
final readonly class LimitNote extends Command implements HasAuthorizationSubject
{
    public function __construct(#[Max(5)] public string $text, #[Max(5)] public string|null $label = null) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return NotePage::class;
    }
}
