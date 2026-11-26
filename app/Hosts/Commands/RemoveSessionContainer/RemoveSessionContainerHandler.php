<?php

declare(strict_types=1);

namespace App\Hosts\Commands\RemoveSessionContainer;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\ArrangementSetting;
use App\Hosts\Enums\HostOrderType;
use App\Hosts\HostOrderPlacement;
use App\Values\HostOrderSource;

final readonly class RemoveSessionContainerHandler implements CommandHandler
{
    public function __construct(private HostOrderPlacement $placement, private ArrangementSetting $arrangement) {}

    public function handle(RemoveSessionContainerCommand $command): string
    {
        return $this->placement->forHost(
            $command->hostId,
            HostOrderSource::fromJournal(),
            HostOrderType::Remove,
            [
                'container' => '',
                'network' => $this->arrangement->sessionContainerName($command->sessionId),
                'session' => $command->sessionId,
            ],
        )->getKey();
    }
}
