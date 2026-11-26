<?php

declare(strict_types=1);

namespace App\Support\Delivery;

use App\Access\StateEvents\StateEventDispatch;
use App\Access\StateEvents\StateEventScope;
use App\Contracts\Events\Event;

/**
 * The dispatcher entry point for an event that registered states can observe.
 */
final readonly class StateEventBridge
{
    public const array LISTENER = [
        self::class,
        'receive',
    ];

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
