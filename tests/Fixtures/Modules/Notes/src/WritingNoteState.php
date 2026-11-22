<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes;

use App\Contracts\Command;
use App\Support\Decisions\Decision;
use App\Support\Inputs\StopRequested;
use App\Support\States\AgentState;
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

    /**
     * @return list<Command<mixed>>
     */
    public function onNoteWritten(NoteWritten $event): array
    {
        if ($event->listenerFails) {
            throw NoteWorkFailed::whileListening();
        }

        return $event->marked;
    }

    /**
     * @return list<Command<mixed>>
     */
    public function onNotePublished(NotePublished $event): array
    {
        return $this->onNoteWritten($event->note);
    }

    public function onNoteAudited(NoteAudited $event): never
    {
        throw NoteWorkFailed::whileListening();
    }
}
