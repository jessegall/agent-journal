<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes;

use App\Bus\Contracts\Command;
use App\Engine\Enums\NoSubject;
use App\Stacks\AgentState;
use App\Stacks\Attributes\StateType;
use App\Stacks\Contracts\Work\DurableState;
use App\Stacks\References\StateReference;
use App\Support\Decisions\Decision;
use App\Support\Inputs\StopRequested;
use App\Values\AgentText;
use Generator;
use Tests\Fixtures\Modules\Notes\Events\NoteAudited;
use Tests\Fixtures\Modules\Notes\Events\NotePublished;
use Tests\Fixtures\Modules\Notes\Events\NoteWritten;
use Tests\Fixtures\Modules\Notes\Exceptions\NoteWorkFailed;

/**
 * While the agent writes a note, it may not stop.
 */
#[StateType(WriteNoteStateReference::class, schemaVersion: 1)]
final class WriteNoteState extends AgentState implements DurableState
{
    public function onStop(StopRequested $input): Decision
    {
        return Decision::deny(AgentText::of('tests.said', ['text' => 'Finish the note first.']));
    }

    /**
     * @return Generator<int, Command<mixed>|StateReference>
     */
    public function onNoteWritten(NoteWritten $event): Generator
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
     * @return Generator<int, Command<mixed>|StateReference>
     */
    public function onNotePublished(NotePublished $event): Generator
    {
        yield from $this->onNoteWritten($event->note);
    }

    public function onNoteAudited(NoteAudited $event): never
    {
        throw NoteWorkFailed::whileListening();
    }
}
