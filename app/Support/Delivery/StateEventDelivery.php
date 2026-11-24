<?php

declare(strict_types=1);

namespace App\Support\Delivery;

use App\Contracts\Bus\Command;
use App\Contracts\Events\Event;
use App\Contracts\Events\ListenerFailureLog;
use App\Declarations\Exceptions\StateEventMethodUnregistered;
use App\Declarations\StateEvents;
use App\Declarations\StateMethod;
use App\Enums\AnswerType;
use App\Enums\CommandEntry;
use App\Enums\StateEventStage;
use App\Exceptions\CommandNotRegistered;
use App\Exceptions\StateAnswerRefused;
use App\Exceptions\StateEventCommandRefused;
use App\Support\CommandRegistry;
use App\Support\Decisions\Decision;
use App\Support\EngineStacks;
use App\Support\References\StateReference;
use App\Support\Stack\SelectedStateMethod;
use App\Support\Stack\StateMethodSelector;
use App\Support\StackTransaction;
use App\Support\StateEvents\Exceptions\StateEventAfterCommitFailed;
use App\Support\StateEvents\ListeningStacks;
use App\Support\StateEvents\StateEventActivity;
use App\Support\StateEvents\StateEventDispatch;
use App\Support\StateEvents\StateEventEffects;
use App\Support\StateEvents\StateEventResult;
use App\Support\StateEvents\StateEventResults;
use App\Support\StateEvents\StateEventStacks;
use App\Values\StackTarget;
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
        private EngineStacks $engineStacks,
        private StateMethodSelector $selector,
        private StateEvents $declarations,
        private CommandRegistry $commands,
        private StateEventEffects $effects,
        private StateEventActivity $activity,
        private LoggerInterface $log,
        private ListeningStacks $listening,
    ) {}

    public function deliver(StateEventDispatch $admitted): void
    {
        $dispatch = $admitted->withListening($this->listening->of($admitted->event));

        if ($dispatch->targets() === []) {
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
        $targets = $dispatch->targets();

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

        $stackAfter = $stack->get();
        $before = $stackAfter->snapshot();

        foreach ($this->selector->forEvent($stackAfter, $dispatch->event) as $selection) {
            $result = $this->invoke($dispatch, $target, $selection);
            $listenerResults[] = $result;

            foreach ($result->pushes as $push) {
                $stackAfter = $stackAfter->withStateOnTop($push);
            }
        }

        $this->engineStacks->keepValues($target, $stackAfter);

        foreach ($before->momentsOf($stackAfter) as $moment) {
            $listenerResults[] = StateEventResult::fromMoment($moment);
        }

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

        $answered = $this->effectsOf($selection->answerEvent($event), $method);
        $result = StateEventResult::fromSelection($selection, $answered);

        foreach (array_filter($result->effects, fn (Command|Event $effect) => $effect instanceof Command) as $command) {
            if (! $this->commands->has($command::class)) {
                throw CommandNotRegistered::for($command::class);
            }

            if ($this->commands->entryOf($command::class) !== CommandEntry::Application) {
                throw StateEventCommandRefused::for($command::class);
            }
        }

        return $result;
    }

    /**
     * What a listener returned, as the commands, events and states to push it asks for: nothing (void, or a delegate
     * decision), one of them, or several from a generator, at most EFFECT_LIMIT; anything else is refused.
     *
     * @return list<Command<mixed>|Event|StateReference>
     *
     * @throws StateAnswerRefused
     */
    private function effectsOf(mixed $answer, StateMethod $method): array
    {
        $listener = "{$method->stateClass}::{$method->name}";

        $effects = match (true) {
            $answer === null, self::isDelegated($answer) => [],
            $answer instanceof Command, $answer instanceof Event, $answer instanceof StateReference => [$answer],
            is_iterable($answer) => iterator_to_array($answer, false),
            default => throw StateAnswerRefused::notAnEffect($listener, get_debug_type($answer)),
        };

        foreach ($effects as $effect) {
            if (! $effect instanceof Command && ! $effect instanceof Event && ! $effect instanceof StateReference) {
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

    /**
     * Whether the answer is a delegate decision, the event method's way of saying the fact asks nothing of it.
     */
    private static function isDelegated(mixed $answer): bool
    {
        return $answer instanceof Decision && $answer->answerType() === AnswerType::Delegate;
    }
}
