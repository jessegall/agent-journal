<?php

declare(strict_types=1);

namespace App\Hooks\Delivery;

use App\Contracts\Event;
use App\Hooks\Delivery\StateEventDelivery;
use App\Hooks\StateEvents\StateEventDispatch;
use App\Hooks\StateEvents\StateEventScope;

/**
 * The dispatcher entry point for an event that registered states can observe.
 */
final readonly class StateEventBridge
{
    public const array LISTENER = [self::class, 'receive'];

    public function __construct(private StateEventScope $scope, private StateEventDelivery $delivery) {}

    public function receive(Event $event): void
    {
        $dispatch = $this->scope->currentDispatch()->filter(
            fn (StateEventDispatch $current) => $current->event === $event,
        );

        if ($dispatch->isDefined()) {
            $this->delivery->deliver($dispatch->get());
        }
    }
}
