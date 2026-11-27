<?php

declare(strict_types=1);

namespace App\Hosts\Commands\CloseHostInput;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\HostOrderPlacement;
use App\Hosts\Protocol\HostOrderType;

final readonly class CloseHostInputHandler implements CommandHandler
{
    public function __construct(private HostOrderPlacement $placement) {}

    public function handle(CloseHostInputCommand $command): string
    {
        return $this->placement->forProcess(
            $command->processId,
            $command->source,
            HostOrderType::CloseStdin,
            [],
        )->getKey();
    }
}
