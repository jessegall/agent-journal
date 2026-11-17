<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Listeners;

use App\Core\Hooks\Events\StateTypesRequested;
use Tests\Fixtures\Modules\Notes\WritingNoteType;

/**
 * The module's own listener: it adds its state type when the core asks for the state types.
 */
final class RegisterNoteStates
{
    public function handle(StateTypesRequested $event): void
    {
        $event->registry->register('notes.writing', new WritingNoteType);
    }
}
