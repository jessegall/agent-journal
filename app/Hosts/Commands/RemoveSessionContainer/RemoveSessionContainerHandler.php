<?php

declare(strict_types=1);

namespace App\Hosts\Commands\RemoveSessionContainer;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\ArrangementSetting;
use App\Hosts\Protocol\Data\HostSessionRemovalData;
use App\Hosts\Protocol\HostOrders;
use App\Values\HostOrderSource;

final readonly class RemoveSessionContainerHandler implements CommandHandler
{
    public function __construct(private HostOrders $orders, private ArrangementSetting $arrangement) {}

    public function handle(RemoveSessionContainerCommand $command): string
    {
        return $this->orders->removeSession(
            $command->hostId,
            HostOrderSource::fromJournal(),
            HostSessionRemovalData::from([
                'network' => $this->arrangement->sessionContainerName($command->sessionId),
                'session' => $command->sessionId,
            ]),
        )->getKey();
    }
}
