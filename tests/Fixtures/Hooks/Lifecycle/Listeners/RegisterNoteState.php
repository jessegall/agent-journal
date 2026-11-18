<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Lifecycle\Listeners;

use App\Hooks\Events\StateTypesRequested;
use Tests\Fixtures\Hooks\Lifecycle\NoteStateLoader;

final class RegisterNoteState
{
    public function handle(StateTypesRequested $event): void
    {
        $event->registry->register('notes.reading', new NoteStateLoader);
    }
}
