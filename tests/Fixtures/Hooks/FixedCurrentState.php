<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Values\StackTarget;
use App\Contracts\Work\CurrentState;
use App\Support\References\StateReference;
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
        return $target == $this->target && isset(
            $this->frames[$typeKey],
        ) ? new Some($this->frames[$typeKey]) : None::create();
    }

    public function top(StackTarget $target): Option
    {
        return $target == $this->target && $this->frames !== [] ? new Some(
            $this->frames[array_key_last($this->frames)],
        ) : None::create();
    }

    public function record(StackTarget $target): Option
    {
        return None::create();
    }
}
