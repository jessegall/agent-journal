<?php

declare(strict_types=1);

namespace App\Support\Delivery;

use App\Access\StateEvents\StateEventDispatch;
use App\Access\StateEvents\StateEventScope;
use App\Asks\Contracts\AnsweredAtOnce;
use App\Contracts\Events\Event;
use App\Support\StateEvents\StateEventPayload;
use Closure;
use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;
use Illuminate\Events\Dispatcher;
use stdClass;

/**
 * Carries an event's captured scope through Laravel's dispatch and transaction scheduling.
 */
final class StateEventDispatcher extends Dispatcher
{
    private readonly object $payloadKey;

    /**
     * @param  Closure(): StateEventScope  $scope
     */
    private function __construct(Container $container, private readonly Closure $scope)
    {
        parent::__construct($container);
        $this->payloadKey = new stdClass();
    }

    /**
     * Builds every class listener from this container from now on: Octane gives it the request's own on each request.
     */
    public function useContainer(Container $container): void
    {
        $this->container = $container;
    }

    /**
     * @param  Closure(): StateEventScope  $scope
     */
    public static function fromDispatcher(Dispatcher $dispatcher, Closure $scope): self
    {
        $wrapped = new self($dispatcher->container, $scope);
        $wrapped->listeners = $dispatcher->listeners;
        $wrapped->wildcards = $dispatcher->wildcards;
        $wrapped->setQueueResolver($dispatcher->queueResolver);
        $wrapped->setTransactionManagerResolver($dispatcher->transactionManagerResolver);

        return $wrapped;
    }

    /**
     * A journal fact dispatched inside a transaction, such as a command's, is heard once it commits and never when it
     * rolls back, wherever it was dispatched from, as if it were marked ShouldDispatchAfterCommit; a question its
     * listeners answer at once, and anything that is no journal fact, is heard at once.
     */
    public function dispatch($event, $arguments = [], $halt = false)
    {
        if (! $event instanceof Event || ! $this->hasBridge($event::class)) {
            return $this->send($event, $arguments, $halt);
        }

        if ($arguments instanceof StateEventPayload && $arguments->hasKey($this->payloadKey)) {
            return $this->send($event, $arguments, $halt);
        }

        $dispatch = ($this->scope)()->capture($event);

        return $this->send($event, new StateEventPayload($this->payloadKey, $dispatch), $halt);
    }

    /**
     * Dispatches a committed fact once under the dispatch staged for it while its command ran.
     */
    public function dispatchStaged(StateEventDispatch $dispatch): mixed
    {
        return parent::dispatch($dispatch->event, new StateEventPayload($this->payloadKey, $dispatch));
    }

    /**
     * Whether a state observes the event through the bridge.
     */
    public function bridges(string $event): bool
    {
        return $this->hasBridge($event);
    }

    /**
     * @return array{string, array<array-key, mixed>}
     */
    protected function parseEventAndPayload($event, $eventArguments): array
    {
        [$name, $arguments] = parent::parseEventAndPayload($event, $eventArguments);

        if ($eventArguments instanceof StateEventPayload && $event === $eventArguments->dispatch->event) {
            $arguments[] = $this->awaitsCommit($eventArguments->dispatch->event)
                ? $eventArguments->scheduledAfterCommit()
                : $eventArguments;
        }

        return [
            $name,
            $arguments,
        ];
    }

    /**
     * @return mixed The first listener result when halting, otherwise the list of responses.
     */
    protected function invokeListeners($event, $arguments, $halt = false): mixed
    {
        if (! is_string($event) || ! $this->hasBridge($event)) {
            return parent::invokeListeners($event, $arguments, $halt);
        }

        $scope = ($this->scope)();
        $captured = $arguments[1] ?? null;

        if (! $captured instanceof StateEventPayload || ! $captured->hasKey($this->payloadKey)) {
            return $scope->deliverWithoutScope(fn () => parent::invokeListeners($event, $arguments, $halt));
        }

        $dispatch = $captured->dispatch;

        return $scope->deliver($dispatch, fn () => parent::invokeListeners($event, [$dispatch->event], $halt));
    }

    /**
     * @return list<Closure>
     */
    public function getListeners($eventName): array
    {
        $listeners = array_values(parent::getListeners($eventName));
        $bridge = $this->bridgePosition($eventName);

        if ($bridge === null) {
            return $listeners;
        }

        $last = array_splice($listeners, $bridge, 1);

        return [
            ...$listeners,
            ...$last,
        ];
    }

    private function awaitsCommit(Event $event): bool
    {
        if (! $this->isHeldFact($event, false)) {
            return false;
        }

        $manager = $this->resolveTransactionManager();

        return $manager !== null && $manager->callbackApplicableTransactions()->isNotEmpty();
    }

    /**
     * Hands the dispatch to Laravel, deferring a journal fact's listeners to the commit the way Laravel defers an
     * event marked ShouldDispatchAfterCommit; with no transaction open they run at once.
     */
    private function send(object|string $event, mixed $payload, bool $halt): mixed
    {
        if (! $this->isHeldFact($event, $halt) || $event instanceof ShouldDispatchAfterCommit) {
            return parent::dispatch($event, $payload, $halt);
        }

        $transactions = $this->resolveTransactionManager();

        if ($transactions === null) {
            return parent::dispatch($event, $payload, $halt);
        }

        [$name, $parsed] = $this->parseEventAndPayload($event, $payload);
        $transactions->addCallback(fn () => $this->invokeListeners($name, $parsed, $halt));

        return null;
    }

    /**
     * Whether the dispatch is a journal fact that waits for the commit: no question answered at once, and no halting
     * dispatch, whose caller waits for the first answer.
     */
    private function isHeldFact(object|string $event, bool $halt): bool
    {
        return $event instanceof Event && ! $event instanceof AnsweredAtOnce && ! $halt;
    }

    private function hasBridge(string $event): bool
    {
        return $this->bridgePosition($event) !== null;
    }

    private function bridgePosition(string $event): int|null
    {
        $listeners = $this->listeners[$event] ?? [];

        if (! is_array($listeners)) {
            return null;
        }

        $position = array_search(StateEventBridge::LISTENER, $listeners, true);

        if (is_int($position)) {
            return $position;
        }

        return null;
    }
}
