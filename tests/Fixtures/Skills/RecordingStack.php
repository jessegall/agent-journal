<?php

declare(strict_types=1);

namespace Tests\Fixtures\Skills;

use App\Agents\Values\StackTarget;
use App\Hooks\Contracts\AgentStack;
use App\Hooks\Decisions\StateReference;

/**
 * An agent stack that only records what was pushed, for listeners tested outside a hook call.
 */
final class RecordingStack implements AgentStack
{
    /**
     * @var list<StateReference>
     */
    public array $pushed = [];

    public function push(StackTarget $target, StateReference $state): void
    {
        $this->pushed[] = $state;
    }
}
