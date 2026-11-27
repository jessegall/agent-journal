<?php

declare(strict_types=1);

namespace App\Hosts\Commands\AllowHostImages;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Protocol\HostInstructions;
use App\Hosts\Protocol\Payloads\HostImagesPlanPayload;
use App\Models\Projects\Host;
use App\Values\HostInstructionSource;

/**
 * Makes the host's allow_images instruction, keeps the images it names on the host, and answers the instruction's id.
 */
final readonly class AllowHostImagesHandler implements CommandHandler
{
    public function __construct(private HostInstructions $instructions) {}

    public function handle(AllowHostImagesCommand $command): string
    {
        $instruction = $this->instructions->allowImages(
            $command->hostId,
            HostInstructionSource::fromJournal(),
            HostImagesPlanPayload::from(['images' => $command->images]),
        );

        Host::findLocked($command->hostId)->allowImages($command->images);

        return $instruction->getKey();
    }
}
