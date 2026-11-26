<?php

declare(strict_types=1);

namespace App\Hosts\Commands\ReadHostFolderAnswer;

use App\Bus\Contracts\CommandHandler;
use App\Exceptions\HostProtocolRefused;
use App\Models\Hosts\HostOrder;
use App\Values\HostFolderAnswer;

/**
 * Answers the state of the host's own folder order; an order of another host is refused.
 */
final readonly class ReadHostFolderAnswerHandler implements CommandHandler
{
    public function handle(ReadHostFolderAnswerCommand $command): HostFolderAnswer
    {
        $order = HostOrder::query()->whereKey($command->orderId)->firstOrFail();

        if ($order->host_id !== $command->hostId) {
            throw HostProtocolRefused::foreignOrder($command->hostId, $command->orderId);
        }

        return HostFolderAnswer::of($order);
    }
}
