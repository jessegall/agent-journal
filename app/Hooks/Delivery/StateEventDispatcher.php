<?php

declare(strict_types=1);

namespace App\Hooks\Delivery;

use App\Contracts\Event;
use App\Hooks\StateEvents\StateEventDispatch;
use App\Hooks\StateEvents\StateEventPayload;
use App\Hooks\StateEvents\StateEventScope;
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

    public function dispatch($event, $arguments = [], $halt = false)
    {
        if (! $event instanceof Event || ! $this->hasBridge($event::class)) {
            return parent::dispatch($event, $arguments, $halt);
        }

        if ($arguments instanceof StateEventPayload && $arguments->hasKey($this->payloadKey)) {
            return parent::dispatch($event, $arguments, $halt);
        }

        $dispatch = ($this->scope)()->capture($event);

        return parent::dispatch($event, new StateEventPayload($this->payloadKey, $dispatch), $halt);
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

        return [$name, $arguments];
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

        return [...$listeners, ...$last];
    }

    private function awaitsCommit(Event $event): bool
    {
        if (! $event instanceof ShouldDispatchAfterCommit) {
            return false;
        }

        $manager = $this->resolveTransactionManager();

        return $manager !== null && $manager->callbackApplicableTransactions()->isNotEmpty();
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

        return is_int($position) ? $position : null;
    }
}
