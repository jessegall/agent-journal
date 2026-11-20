<?php

declare(strict_types=1);

namespace App\Hooks\Events\Support;

use App\Agents\Support\StackTarget;
use App\Bus\Exceptions\CommandNotRegistered;
use App\Bus\Support\CommandRegistry;
use App\Hooks\Declarations\StateEvents;
use App\Hooks\Exceptions\StateEventMethodUnregistered;
use App\Hooks\Stack\SelectedStateMethod;
use App\Hooks\Stack\StateMethodSelector;
use App\Hooks\Support\AgentMessageDelivery;
use App\Hooks\Support\StackTransaction;
use Psr\Log\LoggerInterface;

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
        private LoggerInterface $log,
    ) {}

    public function deliver(StateEventDispatch $dispatch): void
    {
        if ($dispatch->audience->isEmpty()) {
            return;
        }

        $targets = $dispatch->audience->get()->targets;

        $this->transaction->runForTargets($targets, function () use ($targets, $dispatch): void {
            $results = array_map(fn (StackTarget $target) => $this->collect($dispatch, $target), $targets);

            foreach ($results as $result) {
                $this->messages->retainEvent($result->target, $dispatch, $result->context());
            }
        });
    }

    private function collect(StateEventDispatch $dispatch, StackTarget $target): StateEventResults
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

        $this->log->debug('Calling a state event method.', [
            'dispatch' => $dispatch->id,
            'event' => $event::class,
            'state' => $method->stateClass,
            'method' => $method->name,
            'frame' => $selection->frame->id,
            'target' => $target->description(),
            'selection' => $selection->reason->value,
        ]);

        $commands = $selection->frame->state->{$method->name}($event);

        foreach ($commands->all() as $command) {
            if (! $this->commands->has($command::class)) {
                throw CommandNotRegistered::for($command::class);
            }
        }

        return StateEventResult::fromSelection($selection, $commands);
    }
}
