<?php

declare(strict_types=1);

namespace App\Hosts\Commands\CloseHostInput;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Protocol\HostInstructions;

final readonly class CloseHostInputHandler implements CommandHandler
{
    public function __construct(private HostInstructions $instructions) {}

    public function handle(CloseHostInputCommand $command): string
    {
        return $this->instructions->closeStdin($command->processId, $command->source)->getKey();
    }
}
