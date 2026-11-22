<?php

declare(strict_types=1);

namespace App\Hooks\Delivery;

use App\Agents\Values\StackTarget;
use App\Bus\Contracts\Command;
use App\Bus\Enums\CommandEntry;
use App\Bus\Exceptions\CommandNotRegistered;
use App\Bus\Support\CommandRegistry;
use App\Contracts\Event;
use App\Contracts\ListenerFailureLog;
use App\Hooks\Declarations\Exceptions\StateEventMethodUnregistered;
use App\Hooks\Declarations\StateEvents;
use App\Hooks\Declarations\StateMethod;
use App\Hooks\Enums\StateEventStage;
use App\Hooks\Exceptions\StateAnswerRefused;
use App\Hooks\Exceptions\StateEventCommandRefused;
use App\Hooks\Stack\SelectedStateMethod;
use App\Hooks\Stack\StateMethodSelector;
use App\Hooks\StateEvents\Exceptions\StateEventAfterCommitFailed;
use App\Hooks\StateEvents\StateEventActivity;
use App\Hooks\StateEvents\StateEventDispatch;
use App\Hooks\StateEvents\StateEventEffects;
use App\Hooks\StateEvents\StateEventResult;
use App\Hooks\StateEvents\StateEventResults;
use App\Hooks\StateEvents\StateEventStacks;
use App\Hooks\Support\StackTransaction;
use Closure;
use Psr\Log\LoggerInterface;
use Throwable;

/**
 * Collects state event results on live snapshots and retains context after collection succeeds.
 */
final readonly class StateEventDelivery
{
    /**
     * The most commands and events one listener may return for one fact.
     */
    public const int EFFECT_LIMIT = 10;

    public function __construct(
        private StackTransaction $transaction,
        private StateEventStacks $stacks,
        private StateMethodSelector $selector,
        private StateEvents $declarations,
        private CommandRegistry $commands,
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
     * @param  Closure(StateEventStage): void  $advance
     */
    private function deliverToAudience(StateEventDispatch $dispatch, Closure $advance): void
    {
        $targets = $dispatch->audience->get()->targets;

        $collect = fn (): array => array_map(
            fn (StackTarget $target) => $this->collect($dispatch, $target),
            $targets,
        );

        $collected = $this->transaction->runForTargets($targets, $collect);

        $advance(StateEventStage::Effects);

        foreach ($collected as $targetEffects) {
            $this->effects->apply($dispatch, $targetEffects);
        }
    }

    private function collect(StateEventDispatch $dispatch, StackTarget $target): StateEventResults
    {
        $this->activity->assertNotReentered($target);

        return $this->activity->evaluate($target, fn () => $this->evaluate($dispatch, $target));
    }

    private function evaluate(StateEventDispatch $dispatch, StackTarget $target): StateEventResults
    {
        $stack = $this->stacks->restoreActive($dispatch, $target);

        if ($stack->isEmpty()) {
            return new StateEventResults($target, []);
        }

        $listenerResults = [];

        foreach ($this->selector->forEvent($stack->get(), $dispatch->event) as $selection) {
            $listenerResults[] = $this->invoke($dispatch, $target, $selection);
        }

        $this->stacks->keepValues($target, $stack->get());

        return new StateEventResults($target, $listenerResults);
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
        ]);

        $effects = $this->effectsOf($selection->answerEvent($event), $method);

        foreach (array_filter($effects, fn (Command|Event $effect) => $effect instanceof Command) as $command) {
            if (! $this->commands->has($command::class)) {
                throw CommandNotRegistered::for($command::class);
            }

            if ($this->commands->entryOf($command::class) !== CommandEntry::Application) {
                throw StateEventCommandRefused::for($command::class);
            }
        }

        return StateEventResult::fromSelection($selection, $effects);
    }

    /**
     * What a listener returned, as the commands and events it asks for: nothing, one of them, or several from a list
     * or a generator, at most EFFECT_LIMIT; anything else is refused.
     *
     * @return list<Command<mixed>|Event>
     *
     * @throws StateAnswerRefused
     */
    private function effectsOf(mixed $answer, StateMethod $method): array
    {
        $listener = "{$method->stateClass}::{$method->name}";

        $effects = match (true) {
            $answer === null => [],
            $answer instanceof Command, $answer instanceof Event => [$answer],
            is_iterable($answer) => iterator_to_array($answer, false),
            default => throw StateAnswerRefused::notAnEffect($listener, get_debug_type($answer)),
        };

        foreach ($effects as $effect) {
            if (! $effect instanceof Command && ! $effect instanceof Event) {
                throw StateAnswerRefused::notAnEffect($listener, get_debug_type($effect));
            }
        }

        if (count($effects) > self::EFFECT_LIMIT) {
            throw StateAnswerRefused::tooMany($listener, count($effects), self::EFFECT_LIMIT);
        }

        return $effects;
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

        if ($dispatch->event instanceof ListenerFailureLog) {
            return;
        }

        if ($dispatch->afterCommit) {
            throw StateEventAfterCommitFailed::during($dispatch->event::class, $stage, $failure);
        }

        throw $failure;
    }
}
