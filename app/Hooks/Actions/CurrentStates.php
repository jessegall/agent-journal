<?php

declare(strict_types=1);

namespace App\Hooks\Actions;

use App\Agents\Support\StackTarget;
use App\Hooks\Contracts\CurrentState;
use App\Hooks\Contracts\WorkRecordState;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Stack\Frame;
use App\Hooks\Stack\StackRestorer;
use App\Records\Support\RecordIdentity;
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
            $stack = $this->restorer->restore($row->frames);

            return $stack->top()->reference;
        });
    }

    public function record(StackTarget $target): Option
    {
        return AgentStackRow::activeFor($target)->flatMap(function (AgentStackRow $row): Option {
            $frames = $this->restorer->restore($row->frames)->frames();

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
        $subject = $frame->reference->subject;

        if (! $frame->isLive()
            || ! $subject instanceof SubjectReference
            || ! $frame->state instanceof WorkRecordState) {
            return None::create();
        }

        return Option::fromValue(new RecordIdentity($frame->state->workRecordType(), $subject->id));
    }

    /**
     * @param  Closure(Frame): bool  $matches
     * @return Option<StateReference>
     */
    private function highestUnfinished(StackTarget $target, Closure $matches): Option
    {
        return AgentStackRow::activeFor($target)->flatMap(function (AgentStackRow $row) use ($matches): Option {
            foreach (array_reverse($this->restorer->restore($row->frames)->frames()) as $frame) {
                if ($matches($frame) && ! $frame->isFinished()) {
                    return Option::fromValue($frame->reference);
                }
            }

            return None::create();
        });
    }
}
