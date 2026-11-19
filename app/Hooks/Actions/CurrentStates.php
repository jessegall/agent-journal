<?php

declare(strict_types=1);

namespace App\Hooks\Actions;

use App\Agents\Support\StackTarget;
use App\Hooks\Contracts\CurrentState;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Stack\Frame;
use App\Hooks\Stack\StackRestorer;
use Closure;
use PhpOption\None;
use PhpOption\Option;

/**
 * Reads a stack's current state of a type from the top down, without a lock and without writing.
 */
final readonly class CurrentStates implements CurrentState
{
    public function __construct(private StackRestorer $restorer) {}

    public function of(StackTarget $target, string $typeKey): Option
    {
        return $this->highestUnfinished($target, fn (Frame $frame): bool => $frame->typeKey() === $typeKey);
    }

    public function top(StackTarget $target): Option
    {
        return AgentStackRow::activeFor($target)->map(function (AgentStackRow $row): StateReference {
            $stack = $this->restorer->restore($row->frames, $row->frames->role());

            return $stack->top()->reference;
        });
    }

    /**
     * @param  Closure(Frame): bool  $matches
     * @return Option<StateReference>
     */
    private function highestUnfinished(StackTarget $target, Closure $matches): Option
    {
        return AgentStackRow::activeFor($target)->flatMap(function (AgentStackRow $row) use ($matches): Option {
            foreach (array_reverse($this->restorer->restore($row->frames, $row->frames->role())->frames()) as $frame) {
                if ($matches($frame) && ! $frame->isFinished()) {
                    return Option::fromValue($frame->reference);
                }
            }

            return None::create();
        });
    }
}
