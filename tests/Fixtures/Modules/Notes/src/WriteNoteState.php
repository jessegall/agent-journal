<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes;

use App\Attributes\States\StateType;
use App\Contracts\Bus\Command;
use App\Contracts\Work\DurableState;
use App\Enums\Engine\NoSubject;
use App\Support\Decisions\Decision;
use App\Support\Inputs\StopRequested;
use App\Support\References\StateReference;
use App\Support\States\AgentState;
use App\Values\AgentText;
use Tests\Fixtures\Modules\Notes\Events\NoteAudited;
use Tests\Fixtures\Modules\Notes\Events\NotePublished;
use Tests\Fixtures\Modules\Notes\Events\NoteWritten;
use Tests\Fixtures\Modules\Notes\Exceptions\NoteWorkFailed;

/**
 * While the agent writes a note, it may not stop.
 */
#[StateType('notes.writing', schemaVersion: 1)]
final class WriteNoteState extends AgentState implements DurableState
{
    public function onStop(StopRequested $input): Decision
    {
        return Decision::deny(AgentText::of('tests.said', ['text' => 'Finish the note first.']));
    }

    /**
     * @return iterable<Command<mixed>|StateReference>
     */
    public function onNoteWritten(NoteWritten $event): iterable
    {
        if ($event->doesListenerFail) {
            throw NoteWorkFailed::whileListening();
        }

        yield from $event->marked;

        if ($event->asksForGuide) {
            yield new StateReference('guide', NoSubject::None);
        }
    }

    /**
     * @return iterable<Command<mixed>|StateReference>
     */
    public function onNotePublished(NotePublished $event): iterable
    {
        yield from $this->onNoteWritten($event->note);
    }

    public function onNoteAudited(NoteAudited $event): never
    {
        throw NoteWorkFailed::whileListening();
    }
}
