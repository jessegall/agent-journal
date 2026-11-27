<?php

declare(strict_types=1);

namespace App\Hosts\Commands\CloseHostPrivateEntry;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Protocol\HostOrders;

final readonly class CloseHostPrivateEntryHandler implements CommandHandler
{
    public function __construct(private HostOrders $orders) {}

    public function handle(CloseHostPrivateEntryCommand $command): string
    {
        return $this->orders->closePrivate($command->processId, $command->source)->getKey();
    }
}
