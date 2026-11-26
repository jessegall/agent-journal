<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Lifecycle\Listeners;

use App\Events\Hooks\StateTypesRequested;
use App\Stacks\StateLoading\RegisteredStateType;
use Tests\Fixtures\Hooks\Lifecycle\ReadNoteState;

final class RegisterNoteState
{
    public function handle(StateTypesRequested $event): void
    {
        $event->registry->register(RegisteredStateType::named('notes.reading', ReadNoteState::class));
    }
}
