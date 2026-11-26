<?php

declare(strict_types=1);

namespace App\Commands\Hosts\NotifyHostOrder;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Data\Hosts\HostAnswerData;
use App\Exceptions\HostProtocolRefused;
use App\Models\Hosts\HostOrder;

/**
 * Stores the host's answer on its order; an answer to another host's order is refused.
 */
final readonly class NotifyHostOrderHandler implements CommandHandler
{
    public function __construct(private ServerClock $clock) {}

    public function handle(NotifyHostOrderCommand $command): void
    {
        $order = HostOrder::findLocked($command->orderId);

        if ($order->host_id !== $command->hostId) {
            throw HostProtocolRefused::foreignOrder($command->hostId, $order->id);
        }

        $answer = HostAnswerData::from(json_decode($command->body, true, flags: JSON_THROW_ON_ERROR));
        $order->answer($answer, $this->clock->now());
    }
}
