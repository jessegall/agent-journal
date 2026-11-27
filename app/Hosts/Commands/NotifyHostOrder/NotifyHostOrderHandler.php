<?php

declare(strict_types=1);

namespace App\Hosts\Commands\NotifyHostOrder;

use App\Bus\Contracts\CommandHandler;
use App\Exceptions\HostProtocolRefused;
use App\Hosts\Data\HostAnswerData;
use App\Hosts\HostCallReader;
use App\Models\Hosts\HostOrder;
use App\Time\Contracts\ServerClock;

/**
 * Stores the host's answer on its order; an answer to another host's order is refused.
 */
final readonly class NotifyHostOrderHandler implements CommandHandler
{
    public function __construct(private ServerClock $clock, private HostCallReader $reader) {}

    public function handle(NotifyHostOrderCommand $command): void
    {
        $order = HostOrder::findLocked($command->orderId);

        if ($order->host_id !== $command->hostId) {
            throw HostProtocolRefused::foreignOrder($command->hostId, $order->id);
        }

        $answer = $this->reader->read($command->body, HostAnswerData::class, 'answer to order '.$order->id);
        $order->answer($answer, $this->clock->now());
    }
}
