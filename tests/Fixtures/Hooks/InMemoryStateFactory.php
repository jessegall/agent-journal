<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Support\Stack\Contracts\StateFactory;
use App\Support\References\StateReference;
use App\Support\Stack\Frames\Frame;
use App\Support\States\AgentState;
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
