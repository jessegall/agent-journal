<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Lifecycle;

use App\Hooks\Contracts\StateLoader;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Decisions\StateSet;
use App\Hooks\Enums\NoSubject;
use App\Hooks\States\AgentState;

/**
 * A fixture state type whose states log their lifecycle calls; a test marks subjects finished between operations.
 */
final class RecordingStateLoader implements StateLoader
{
    /**
     * @var list<string> subjects whose work is done
     */
    public array $finished = [];

    public function __construct(private readonly LifecycleLog $log) {}

    public function statesFor(StateReferences $references): StateSet
    {
        return StateSet::build($references, fn (StateReference $reference): AgentState => new RecordingState(
            $reference->subject === NoSubject::None ? '' : $reference->subject->id,
            $reference->subject !== NoSubject::None && in_array($reference->subject->id, $this->finished, true),
            $this->log,
        ));
    }

    public function schemaVersion(): int
    {
        return 1;
    }
}
