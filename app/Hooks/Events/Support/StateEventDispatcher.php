<?php

declare(strict_types=1);

namespace App\Hooks\Events\Support;

use App\Contracts\Event;
use App\Hooks\Events\StateEventBridge;
use Closure;
use Illuminate\Contracts\Container\Container;
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

        $captured = $payload instanceof StateEventPayload && $payload->hasKey($this->payloadKey)
            ? $payload
            : new StateEventPayload($this->payloadKey, ($this->scope)()->capture($event));

        return parent::dispatch($event, $captured, $halt);
    }

    protected function parseEventAndPayload($event, $payload): array
    {
        [$name, $arguments] = parent::parseEventAndPayload($event, $payload);

        if ($payload instanceof StateEventPayload && $event === $payload->dispatch->event) {
            $arguments[] = $payload;
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

    private function hasBridge(string $event): bool
    {
        return in_array(StateEventBridge::LISTENER, $this->listeners[$event] ?? [], true);
    }
}
