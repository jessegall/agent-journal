<?php

declare(strict_types=1);

namespace App\Commands\Hosts\CloseHostPrivateEntry;

use App\Contracts\Bus\CommandHandler;
use App\Enums\Hosts\HostOrderType;
use App\Support\Hosts\HostOrderPlacement;

final readonly class CloseHostPrivateEntryHandler implements CommandHandler
{
    public function __construct(private HostOrderPlacement $placement) {}

    public function handle(CloseHostPrivateEntryCommand $command): string
    {
        return $this->placement->forProcess($command->processId, $command->source, HostOrderType::ClosePrivate, [])->id;
    }
}
