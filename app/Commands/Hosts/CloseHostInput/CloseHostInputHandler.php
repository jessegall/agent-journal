<?php

declare(strict_types=1);

namespace App\Commands\Hosts\CloseHostInput;

use App\Contracts\Bus\CommandHandler;
use App\Enums\Hosts\HostOrderType;
use App\Support\Hosts\HostOrderPlacement;

final readonly class CloseHostInputHandler implements CommandHandler
{
    public function __construct(private HostOrderPlacement $placement) {}

    public function handle(CloseHostInputCommand $command): string
    {
        return $this->placement->forProcess($command->processId, $command->source, HostOrderType::CloseStdin, [])->id;
    }
}
