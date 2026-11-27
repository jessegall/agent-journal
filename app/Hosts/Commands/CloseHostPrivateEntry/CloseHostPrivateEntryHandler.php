<?php

declare(strict_types=1);

namespace App\Hosts\Commands\CloseHostPrivateEntry;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Protocol\HostInstructions;

final readonly class CloseHostPrivateEntryHandler implements CommandHandler
{
    public function __construct(private HostInstructions $instructions) {}

    public function handle(CloseHostPrivateEntryCommand $command): string
    {
        return $this->instructions->closePrivate($command->processId, $command->source)->getKey();
    }
}
