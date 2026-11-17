<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Domain\Hooks\Decisions\StateReference;
use App\Domain\Hooks\Stack\Frame;
use App\Domain\Hooks\Stack\StateFactory;
use App\Domain\Hooks\States\AgentState;
use Closure;

/**
 * A state factory for tests: each state type is a closure, and new frames are numbered pushed-1, pushed-2 and so on.
 */
final class InMemoryStateFactory implements StateFactory
{
    private int $pushedCount = 0;

    /**
     * @param  array<string, Closure(StateReference): AgentState>  $types
     */
    public function __construct(private readonly array $types = []) {}

    public function frameFor(StateReference $reference): Frame
    {
        $this->pushedCount++;

        return new Frame("pushed-{$this->pushedCount}", $reference, ($this->types[$reference->typeKey])($reference));
    }
}
