<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes;

use App\Hooks\Attributes\StackWide;
use App\Hooks\Decisions\Decision;
use App\Hooks\Inputs\StopRequested;
use App\Hooks\States\AgentState;
use App\Hooks\Values\EventCommands;
use Tests\Fixtures\Modules\Notes\Events\NoteAudited;
use Tests\Fixtures\Modules\Notes\Events\NotePublished;
use Tests\Fixtures\Modules\Notes\Events\NoteWritten;
use Tests\Fixtures\Modules\Notes\Exceptions\NoteWorkFailed;

/**
 * While the agent writes a note, it may not stop.
 */
final class WritingNoteState extends AgentState
{
    public function onStop(StopRequested $input): Decision
    {
        return Decision::deny('Finish the note first.');
    }

    #[StackWide]
    public function onNoteWritten(NoteWritten $event): EventCommands
    {
        if ($event->listenerFails) {
            throw NoteWorkFailed::whileListening();
        }

        return EventCommands::of(...$event->marked)->withContext('A note was written.');
    }

    #[StackWide]
    public function onNotePublished(NotePublished $event): EventCommands
    {
        return $this->onNoteWritten($event->note);
    }

    public function onNoteAudited(NoteAudited $event): EventCommands
    {
        throw NoteWorkFailed::whileListening();
    }
}
