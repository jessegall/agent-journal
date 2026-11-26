<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Work\CurrentState as CurrentStateContract;
use App\Contracts\Work\WorkState;
use App\Models\Agents\AgentStackRow;
use App\Support\References\StateReference;
use App\Support\Stack\Frames\Frame;
use App\Support\Stack\StackRestorer;
use App\Values\StackTarget;
use Closure;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * Reads a stack's current state of a type from the top down, without a lock and without writing.
 */
final readonly class CurrentState implements CurrentStateContract
{
    public function __construct(private StackRestorer $restorer, private CallerStackTargets $targets) {}

    public function of(StackTarget $target, string $typeKey): Option
    {
        return $this->highestLive($target, fn (Frame $frame) => $frame->typeKey() === $typeKey);
    }

    public function ofCaller(string $typeKey): Option
    {
        $target = $this->targets->ofCaller()[0] ?? null;

        if ($target === null) {
            return None::create();
        }

        return $this->of($target, $typeKey);
    }

    public function top(StackTarget $target): Option
    {
        return AgentStackRow::findActiveFor($target)->map(function (AgentStackRow $row): StateReference {
            $stack = $this->restorer->restore($row->frames, $row->target);

            return $stack->top()->reference;
        });
    }

    public function record(StackTarget $target): Option
    {
        return AgentStackRow::findActiveFor($target)->flatMap(function (AgentStackRow $row): Option {
            $frames = $this->restorer->restore($row->frames, $row->target)->frames();

            foreach (array_reverse($frames) as $frame) {
                $record = $this->workRecord($frame);

                if ($record->isDefined()) {
                    return $record;
                }
            }

            return None::create();
        });
    }

    /**
     * @return Option<RecordIdentity>
     */
    private function workRecord(Frame $frame): Option
    {
        if (! $frame->isLive() || ! $frame->state instanceof WorkState) {
            return None::create();
        }

        return new Some($frame->state->stateSubject());
    }

    /**
     * @param  Closure(Frame): bool  $matches
     * @return Option<StateReference>
     */
    private function highestLive(StackTarget $target, Closure $matches): Option
    {
        return AgentStackRow::findActiveFor($target)->flatMap(function (AgentStackRow $row) use ($matches): Option {
            foreach (array_reverse($this->restorer->restore($row->frames, $row->target)->frames()) as $frame) {
                if ($matches($frame) && $frame->isLive()) {
                    return Option::fromValue($frame->reference);
                }
            }

            return None::create();
        });
    }
}
