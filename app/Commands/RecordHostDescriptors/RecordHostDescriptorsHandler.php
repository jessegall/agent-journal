<?php

declare(strict_types=1);

namespace App\Commands\RecordHostDescriptors;

use App\Contracts\CommandHandler;
use App\Models\Host;
use App\Support\HostDescriptorEnrollment;
use App\Values\EnrolledDescriptor;

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
