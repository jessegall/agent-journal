<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes;

use App\Attributes\StateType;
use App\Contracts\Bus\Command;
use App\Enums\SessionTransferType;
use App\Support\Decisions\Decision;
use App\Support\Inputs\StopRequested;
use App\Support\States\AgentState;
use App\Values\AgentText;
use Tests\Fixtures\Modules\Notes\Events\NoteAudited;
use Tests\Fixtures\Modules\Notes\Events\NotePublished;
use Tests\Fixtures\Modules\Notes\Events\NoteWritten;
use Tests\Fixtures\Modules\Notes\Exceptions\NoteWorkFailed;

/**
 * While the agent writes a note, it may not stop.
 */
#[StateType('notes.writing', schemaVersion: 1, transfer: SessionTransferType::Durable)]
final class WritingNoteState extends AgentState
{
    public function onStop(StopRequested $input): Decision
    {
        return Decision::deny(AgentText::of('tests.said', ['text' => 'Finish the note first.']));
    }

    /**
     * @return iterable<Command<mixed>>
     */
    public function onNoteWritten(NoteWritten $event): iterable
    {
        if ($event->listenerFails) {
            throw NoteWorkFailed::whileListening();
        }

        return $event->marked;
    }

    /**
     * @return iterable<Command<mixed>>
     */
    public function onNotePublished(NotePublished $event): iterable
    {
        return $this->onNoteWritten($event->note);
    }

    public function onNoteAudited(NoteAudited $event): never
    {
        throw NoteWorkFailed::whileListening();
    }
}
