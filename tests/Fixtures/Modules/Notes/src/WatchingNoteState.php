<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes;

use App\Attributes\StateType;
use App\Enums\SessionTransferType;
use App\Contracts\Bus\Command;
use App\Support\States\AgentState;
use Tests\Fixtures\Modules\Notes\Events\NoteWritten;

/**
 * An ordinary state listener with a result prescribed by the fixture.
 */
#[StateType('notes.watching', schemaVersion: 1, transfer: SessionTransferType::SessionOnly)]
final class WatchingNoteState extends AgentState
{
    /**
     * @return iterable<Command<mixed>>
     */
    public function onNoteWritten(NoteWritten $event): iterable
    {
        yield from $event->ordinary;
    }
}
