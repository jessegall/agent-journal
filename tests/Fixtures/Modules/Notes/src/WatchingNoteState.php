<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes;

use App\Contracts\Command;
use App\Support\States\AgentState;
use Tests\Fixtures\Modules\Notes\Events\NoteWritten;

/**
 * An ordinary state listener with a result prescribed by the fixture.
 */
final class WatchingNoteState extends AgentState
{
    /**
     * @return list<Command<mixed>>
     */
    public function onNoteWritten(NoteWritten $event): array
    {
        return $event->ordinary;
    }
}
