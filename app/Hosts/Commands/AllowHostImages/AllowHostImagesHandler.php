<?php

declare(strict_types=1);

namespace App\Hosts\Commands\AllowHostImages;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Protocol\HostInstructions;
use App\Hosts\Protocol\Payloads\HostImagesPlanPayload;
use App\Models\Hosts\HostInstruction;
use App\Models\Projects\Host;
use App\Models\Projects\HostDriverImage;
use App\Values\HostInstructionSource;

/**
 * Makes the host's allow_images instruction, keeps the images it names on the host, and answers the instruction's id.
 */
final readonly class AllowHostImagesHandler implements CommandHandler
{
    public function __construct(private HostInstructions $instructions) {}

    /**
     * The id of the allow set that carries the images: a new one, or the one still out, after whose answer the newest
     * set is sent, so the host never holds two crossing sets.
     */
    public function handle(AllowHostImagesCommand $command): string
    {
        $host = Host::findLocked($command->hostId);
        $outstanding = HostInstruction::findOutstandingAllowOf($host);

        if ($outstanding !== null) {
            return $outstanding->getKey();
        }

        $instruction = $this->instructions->allowImages(
            $command->hostId,
            HostInstructionSource::fromJournal(),
            HostImagesPlanPayload::from(['images' => $command->images]),
        );
        $host->allowImages($command->images);

        foreach (HostDriverImage::findAllowingOn($host->id) as $image) {
            $image->orderedIn($instruction->getKey());
        }

        return $instruction->getKey();
    }
}
