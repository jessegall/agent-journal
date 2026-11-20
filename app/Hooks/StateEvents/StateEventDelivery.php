<?php

declare(strict_types=1);

namespace App\Hooks\StateEvents;

use App\Agents\Support\StackTarget;
use App\Bus\Enums\CommandEntry;
use App\Bus\Exceptions\CommandNotRegistered;
use App\Bus\Support\CommandRegistry;
use App\Contracts\LogsListenerFailures;
use App\Hooks\Enums\StateEventStage;
use App\Hooks\Declarations\StateEvents;
use App\Hooks\Exceptions\StateEventAfterCommitFailed;
use App\Hooks\Exceptions\StateEventCommandRefused;
use App\Hooks\Exceptions\StateEventMethodUnregistered;
use App\Hooks\Stack\SelectedStateMethod;
use App\Hooks\Stack\StateMethodSelector;
use App\Hooks\Support\AgentMessageDelivery;
use App\Hooks\Support\StackTransaction;
use Closure;
use Psr\Log\LoggerInterface;
use Throwable;

/**
 * Collects state event results on live snapshots and retains context after collection succeeds.
 */
final readonly class StateEventDelivery
{
    public function __construct(
        private StackTransaction $transaction,
        private StateEventStacks $stacks,
        private StateMethodSelector $selector,
        private StateEvents $declarations,
        private CommandRegistry $commands,
        private AgentMessageDelivery $messages,
        private StateEventEffects $effects,
        private StateEventActivity $activity,
        private LoggerInterface $log,
    ) {}

    public function deliver(StateEventDispatch $dispatch): void
    {
        if ($dispatch->audience->isEmpty()) {
            return;
        }

        $stage = StateEventStage::Collection;
        $advance = static function (StateEventStage $next) use (&$stage): void {
            $stage = $next;
        };

        try {
            $this->activity->delivering(fn () => $this->deliverToAudience($dispatch, $advance));
        } catch (Throwable $failure) {
            $this->reportFailure($dispatch, $stage, $failure);
        }
    }

    /**
     * @param Closure(StateEventStage): void $advance
     */
    private function deliverToAudience(StateEventDispatch $dispatch, Closure $advance): void
    {
        $targets = $dispatch->audience->get()->targets;

        $collect = function () use ($targets, $dispatch, $advance): array {
            $results = array_map(fn (StackTarget $target) => $this->collect($dispatch, $target), $targets);
            $advance(StateEventStage::Retention);

            foreach ($results as $result) {
                $this->messages->retainEvent($result->target, $dispatch, $result->context());
            }

            return $results;
        };
        $collected = $this->transaction->runForTargets($targets, $collect);

        $advance(StateEventStage::Effects);

        foreach ($collected as $result) {
            $this->effects->apply($dispatch, $result);
        }
    }

    private function collect(StateEventDispatch $dispatch, StackTarget $target): StateEventResults
    {
        $this->activity->checkForReentry($target);

        return $this->activity->evaluate($target, fn () => $this->evaluate($dispatch, $target));
    }

    private function evaluate(StateEventDispatch $dispatch, StackTarget $target): StateEventResults
    {
        $stack = $this->stacks->restoreActive($dispatch, $target);

        if ($stack->isEmpty()) {
            return new StateEventResults($target, []);
        }

        $results = [];

        foreach ($this->selector->forEvent($stack->get(), $dispatch->event) as $selection) {
            $results[] = $this->invoke($dispatch, $target, $selection);
        }

        return new StateEventResults($target, $results);
    }

    private function invoke(
        StateEventDispatch $dispatch,
        StackTarget $target,
        SelectedStateMethod $selection,
    ): StateEventResult {
        $event = $dispatch->event;
        $method = $selection->method;

        if (! $this->declarations->contains($event, $method)) {
            throw StateEventMethodUnregistered::for($event::class, $method);
        }

        $this->activity->trackOrigin($target, $selection->frame->id, $event::class);
        $this->log->debug('Calling a state event method.', [
            'dispatch' => $dispatch->id,
            'event' => $event::class,
            'state' => $method->stateClass,
            'method' => $method->name,
            'frame' => $selection->frame->id,
            'target' => $target->description(),
            'selection' => $selection->reason->value,
        ]);

        $commands = $selection->answerEvent($event);

        foreach ($commands->all() as $command) {
            if (! $this->commands->has($command::class)) {
                throw CommandNotRegistered::for($command::class);
            }

            if ($this->commands->entryOf($command::class) !== CommandEntry::Application) {
                throw StateEventCommandRefused::for($command::class);
            }
        }

        return StateEventResult::fromSelection($selection, $commands);
    }

    private function reportFailure(StateEventDispatch $dispatch, StateEventStage $stage, Throwable $failure): void
    {
        $this->log->error('State event delivery failed.', [
            'dispatch' => $dispatch->id,
            'event' => $dispatch->event::class,
            'stage' => $stage->value,
            'after_commit' => $dispatch->afterCommit,
            'failure' => $failure::class,
        ]);

        if ($dispatch->event instanceof LogsListenerFailures) {
            return;
        }

        if ($dispatch->afterCommit) {
            throw StateEventAfterCommitFailed::during($dispatch->event::class, $stage, $failure);
        }

        throw $failure;
    }
}
