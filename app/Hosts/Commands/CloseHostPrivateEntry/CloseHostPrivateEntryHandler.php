<?php

declare(strict_types=1);

namespace App\Hosts\Commands\CloseHostPrivateEntry;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Enums\HostOrderType;
use App\Hosts\HostOrderPlacement;

final readonly class CloseHostPrivateEntryHandler implements CommandHandler
{
    public function __construct(private HostOrderPlacement $placement) {}

    public function handle(CloseHostPrivateEntryCommand $command): string
    {
        return $this->placement->forProcess(
            $command->processId,
            $command->source,
            HostOrderType::ClosePrivate,
            [],
        )->getKey();
    }
}
