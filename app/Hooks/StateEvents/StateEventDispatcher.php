<?php

declare(strict_types=1);

namespace App\Hooks\StateEvents;

use App\Contracts\Event;
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
     * @param Closure(): StateEventScope $scope
     */
    private function __construct(Container $container, private readonly Closure $scope)
    {
        parent::__construct($container);
        $this->payloadKey = new stdClass();
    }

    /**
     * @param Closure(): StateEventScope $scope
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

    public function dispatch($event, $payload = [], $halt = false)
    {
        if (! $event instanceof Event || ! $this->hasBridge($event::class)) {
            return parent::dispatch($event, $payload, $halt);
        }

        if ($payload instanceof StateEventPayload && $payload->hasKey($this->payloadKey)) {
            return parent::dispatch($event, $payload, $halt);
        }

        $dispatch = ($this->scope)()->capture($event);

        return parent::dispatch($event, new StateEventPayload($this->payloadKey, $dispatch), $halt);
    }

    protected function parseEventAndPayload($event, $payload): array
    {
        [$name, $arguments] = parent::parseEventAndPayload($event, $payload);

        if ($payload instanceof StateEventPayload && $event === $payload->dispatch->event) {
            $arguments[] = $this->awaitsCommit($payload->dispatch->event)
                ? $payload->scheduledAfterCommit()
                : $payload;
        }

        return [$name, $arguments];
    }

    protected function invokeListeners($event, $payload, $halt = false)
    {
        if (! $this->hasBridge($event)) {
            return parent::invokeListeners($event, $payload, $halt);
        }

        $scope = ($this->scope)();
        $captured = $payload[1] ?? null;

        if (! $captured instanceof StateEventPayload || ! $captured->hasKey($this->payloadKey)) {
            return $scope->deliverWithoutScope(fn () => parent::invokeListeners($event, $payload, $halt));
        }

        $dispatch = $captured->dispatch;

        return $scope->deliver($dispatch, fn () => parent::invokeListeners($event, [$dispatch->event], $halt));
    }

    public function getListeners($eventName): array
    {
        $listeners = parent::getListeners($eventName);
        $bridge = array_search(StateEventBridge::LISTENER, $this->listeners[$eventName] ?? [], true);

        if ($bridge === false) {
            return $listeners;
        }

        $last = $listeners[$bridge];
        unset($listeners[$bridge]);

        return [...array_values($listeners), $last];
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
        return in_array(StateEventBridge::LISTENER, $this->listeners[$event] ?? [], true);
    }
}
