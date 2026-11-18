<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Agents\Support\StackTarget;
use App\Hooks\Contracts\CurrentState;
use App\Hooks\Decisions\StateReference;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * A current-state read for tests: one stack target works on the given frames, keyed by type; every other target and
 * type has none.
 */
final readonly class FixedCurrentState implements CurrentState
{
    /**
     * @param  array<string, StateReference>  $frames  the current frame of each type on the target's stack
     */
    public function __construct(private StackTarget $target, private array $frames) {}

    public function of(StackTarget $target, string $typeKey): Option
    {
        return $target == $this->target && isset($this->frames[$typeKey]) ? new Some($this->frames[$typeKey]) : None::create();
    }
}
