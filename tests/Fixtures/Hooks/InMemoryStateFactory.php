<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Agents\Values\StackTarget;
use App\Hooks\Stack\Contracts\StateFactory;
use App\Hooks\References\StateReference;
use App\Hooks\Stack\Frames\Frame;
use App\Hooks\States\AgentState;
use Carbon\CarbonImmutable;
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

    public function frameFor(StateReference $reference, StackTarget $target): Frame
    {
        $this->pushedCount++;

        return new Frame(
"pushed-{$this->pushedCount}",
 $reference,
 ($this->types[$reference->typeKey])($reference),
 CarbonImmutable::now(),
);
    }

    public function isEnabled(StateReference $reference): bool
    {
        return true;
    }
}
