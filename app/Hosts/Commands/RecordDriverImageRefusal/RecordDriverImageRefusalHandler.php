<?php

declare(strict_types=1);

namespace App\Hosts\Commands\RecordDriverImageRefusal;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Protocol\HostImageFaultType;
use App\Hosts\Protocol\HostRefusal;
use App\Hosts\Protocol\Payloads\HostImageFaultFactsPayload;
use App\Models\Hosts\HostInstruction;
use App\Models\Projects\Host;
use App\Models\Projects\HostDriverImage;

final readonly class RecordDriverImageRefusalHandler implements CommandHandler
{
    /**
     * The refusals that only interrupted the image's instruction, so the image is built again within its recoveries.
     */
    private const array INTERRUPTIONS = [
        HostRefusal::HostRestarted,
        HostRefusal::Expired,
        HostRefusal::NotRunning,
    ];

    public function handle(RecordDriverImageRefusalCommand $command): void
    {
        $instruction = HostInstruction::findLocked($command->instructionId);
        Host::findLocked($instruction->host_id);
        $refusal = $instruction->refusal ?? HostRefusal::Unsafe;

        foreach (HostDriverImage::findWaitingOn($instruction->id) as $image) {
            if (! $image->waitsOn($instruction->id)) {
                continue;
            }

            $this->settle($image, $refusal, $instruction);
        }
    }

    private function settle(HostDriverImage $image, HostRefusal $refusal, HostInstruction $instruction): void
    {
        if (in_array($refusal, self::INTERRUPTIONS, true)) {
            $image->interrupted("the host answered {$refusal->value}");

            return;
        }

        if ($refusal !== HostRefusal::ImageFault) {
            $image->refuse("the host refused the image's {$instruction->type->value} as {$refusal->value}");

            return;
        }

        $fault = HostImageFaultFactsPayload::from($instruction->answerFacts());

        match ($fault->fault) {
            HostImageFaultType::DaemonUnavailable => $image->interrupted('the Docker daemon could not be reached'),
            HostImageFaultType::ImageAbsent => $fault->reference === $image->image
                ? $image->absent()
                : $image->interrupted("the Docker daemon lacks {$fault->reference}"),
            HostImageFaultType::DigestMismatch => $image->refuse("another image is held as {$fault->reference}"),
        };
    }
}
