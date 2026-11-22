<?php

declare(strict_types=1);

namespace App\Agents\Commands\RecordHostDescriptors;

use App\Agents\Models\Host;
use App\Agents\Support\HostDescriptorEnrollment;
use App\Agents\Values\EnrolledDescriptor;
use App\Contracts\CommandHandler;

final readonly class RecordHostDescriptorsHandler implements CommandHandler
{
    public function __construct(private HostDescriptorEnrollment $enrollment) {}

    public function handle(RecordHostDescriptorsCommand $command): void
    {
        Host::query()->lockForUpdate()->findOrFail($command->hostId)->recordDescriptors(
            $command->protocolVersion,
            array_map(
                fn (EnrolledDescriptor $descriptor) => $descriptor->stored(),
                $this->enrollment->enroll($command->descriptors),
            ),
        );
    }
}
