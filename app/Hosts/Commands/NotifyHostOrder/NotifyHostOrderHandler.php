<?php

declare(strict_types=1);

namespace App\Hosts\Commands\NotifyHostOrder;

use App\Bus\Contracts\CommandHandler;
use App\Exceptions\HostProtocolRefused;
use App\Hosts\HostCallReader;
use App\Hosts\Protocol\Data\HostAnswerData;
use App\Hosts\Protocol\HostAnswerStatus;
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

        $answer = HostAnswerData::from(json_decode($command->answer, true, flags: JSON_THROW_ON_ERROR));

        // A done answer carries the order's reply as its facts, read as strictly as the answer itself.
        if ($answer->status === HostAnswerStatus::Done) {
            $reply = json_encode($answer->facts, JSON_THROW_ON_ERROR);
            $this->reader->read($reply, $order->type->replyData(), "reply to {$order->type->value}");
        }

        $order->answer($answer, $this->clock->now());
    }
}
