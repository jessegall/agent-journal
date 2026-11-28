<?php

declare(strict_types=1);

namespace App\Hosts\Commands\RemoveHostImage;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Protocol\HostInstructions;
use App\Hosts\Protocol\Payloads\HostImageRemovalPayload;
use App\Values\HostInstructionSource;

final readonly class RemoveHostImageHandler implements CommandHandler
{
    public function __construct(private HostInstructions $instructions) {}

    public function handle(RemoveHostImageCommand $command): string
    {
        return $this->instructions->removeImage(
            $command->hostId,
            HostInstructionSource::fromJournal(),
            HostImageRemovalPayload::from(['image' => $command->image]),
        )->getKey();
    }
}
