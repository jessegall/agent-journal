<?php

declare(strict_types=1);

namespace App\Hosts\Commands\OpenHostPrivateEntry;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Protocol\HostOrders;

final readonly class OpenHostPrivateEntryHandler implements CommandHandler
{
    public function __construct(private HostOrders $orders) {}

    public function handle(OpenHostPrivateEntryCommand $command): string
    {
        return $this->orders->openPrivate($command->processId, $command->source)->getKey();
    }
}
