<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Ticks;

use App\Hooks\Contracts\WorkOccurrenceGuard;
use App\Hooks\Contracts\TickableStateLoader;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Decisions\StateSet;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\States\AgentState;
use App\Hooks\Ticks\TickCommands;
use App\Hooks\Ticks\TickContext;
use Closure;

/**
 * A ticking state type whose ticks a test scripts per subject; every tick context its states are given is kept.
 */
final class ScriptedTickingLoader implements TickableStateLoader
{
    /**
     * @var array<string, list<TickContext>>
     */
    public array $ticks = [];

    /**
     * @var array<string, Closure(TickContext): TickCommands> what a subject's tick does; none means it asks for nothing
     */
    public array $scripts = [];

    public ScriptedOccurrenceGuard $guard;

    public function __construct()
    {
        $this->guard = new ScriptedOccurrenceGuard();
    }

    public function stateClass(): string
    {
        return ScriptedTickingState::class;
    }

    public function statesFor(StateReferences $references): StateSet
    {
        return StateSet::build($references, fn (StateReference $reference): AgentState => new ScriptedTickingState(
            $reference->subject instanceof SubjectReference ? $reference->subject->id : '',
            $this,
        ));
    }

    public function schemaVersion(): int
    {
        return 1;
    }

    public function tick(string $subject, TickContext $tick): TickCommands
    {
        $this->ticks[$subject][] = $tick;

        return isset($this->scripts[$subject]) ? ($this->scripts[$subject])($tick) : TickCommands::none();
    }

    public function occurrenceGuard(): WorkOccurrenceGuard
    {
        return $this->guard;
    }
}
