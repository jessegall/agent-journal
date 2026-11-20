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
    /**
     * @param list<string> $context
     */
    public function __construct(private readonly array $context) {}

    public function onNoteWritten(NoteWritten $event): EventCommands
    {
        $result = EventCommands::of(...$event->ordinary);

        foreach ($this->context as $line) {
            $result = $result->withContext($line);
        }

        return $result;
    }
}
