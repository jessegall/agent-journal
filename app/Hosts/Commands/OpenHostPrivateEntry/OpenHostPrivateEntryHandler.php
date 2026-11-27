<?php

declare(strict_types=1);

namespace App\Hosts\Commands\OpenHostPrivateEntry;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Protocol\HostInstructions;

final readonly class OpenHostPrivateEntryHandler implements CommandHandler
{
    public function __construct(private HostInstructions $instructions) {}

    public function handle(OpenHostPrivateEntryCommand $command): string
    {
        return $this->instructions->openPrivate($command->processId, $command->source)->getKey();
    }
}
