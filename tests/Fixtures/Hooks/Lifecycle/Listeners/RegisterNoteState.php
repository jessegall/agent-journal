<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Lifecycle\Listeners;

use App\Events\Hooks\StateTypesRequested;
use App\Support\StateLoading\RegisteredStateType;
use Tests\Fixtures\Hooks\Lifecycle\ReadingNoteState;

final class RegisterNoteState
{
    public function handle(StateTypesRequested $event): void
    {
        $event->registry->register(RegisteredStateType::named('notes.reading', ReadingNoteState::class));
    }
}
