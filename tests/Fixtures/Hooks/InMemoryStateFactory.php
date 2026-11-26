<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Stacks\AgentState;
use App\Stacks\Contracts\StateFactory;
use App\Stacks\Frames\Frame;
use App\Stacks\References\StateReference;
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

    public function frameFor(StateReference $reference): Frame
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
