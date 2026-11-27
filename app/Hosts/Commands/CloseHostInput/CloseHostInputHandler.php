<?php

declare(strict_types=1);

namespace App\Hosts\Commands\CloseHostInput;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Protocol\HostOrders;

final readonly class CloseHostInputHandler implements CommandHandler
{
    public function __construct(private HostOrders $orders) {}

    public function handle(CloseHostInputCommand $command): string
    {
        return $this->orders->closeStdin($command->processId, $command->source)->getKey();
    }
}
