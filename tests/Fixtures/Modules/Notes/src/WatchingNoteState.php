<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes;

use App\Hooks\States\AgentState;
use App\Hooks\Values\EventCommands;
use Tests\Fixtures\Modules\Notes\Events\NoteWritten;

/**
 * An ordinary state listener with a result prescribed by the fixture.
 */
final class WatchingNoteState extends AgentState
{
    public function __construct(private readonly EventCommands $result) {}

    public function onNoteWritten(NoteWritten $event): EventCommands
    {
        return $this->result;
    }
}
