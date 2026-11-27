<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes;

use App\Bus\Contracts\Command;
use App\Stacks\AgentState;
use App\Stacks\Attributes\StateType;
use Generator;
use Tests\Fixtures\Modules\Notes\Events\NoteWritten;

/**
 * An ordinary state listener with a result prescribed by the fixture.
 */
#[StateType(WatchNoteStateReference::class, schemaVersion: 1)]
final class WatchNoteState extends AgentState
{
    /**
     * @return Generator<int, Command<mixed>>
     */
    public function onNoteWritten(NoteWritten $event): Generator
    {
        yield from $event->ordinary;
    }
}
