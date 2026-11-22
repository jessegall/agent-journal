<?php

declare(strict_types=1);

namespace App\Connections\Commands\RecordBindingPresence;

use App\Agents\Support\HostDescriptorEnrollment;
use App\Agents\Values\EnrolledDescriptor;
use App\Connections\Exceptions\PresenceRefused;
use App\Connections\Models\ProjectBinding;
use App\Connections\Values\PresenceReceipt;
use App\Contracts\CommandHandler;

/**
 * Locks the binding, refuses a report from any host but its own or for a revoked binding, records the report on the
 * binding and the combinations it reports on the binding's host, as what that host can start.
 */
final readonly class RecordBindingPresenceHandler implements CommandHandler
{
    public function __construct(private HostDescriptorEnrollment $enrollment) {}

    public function handle(RecordBindingPresenceCommand $command): PresenceReceipt
    {
        $binding = ProjectBinding::lockById($command->bindingId);

        if (! $binding->isReportableBy($command->hostId)) {
            throw PresenceRefused::notTheHost($binding->id);
        }

        $receipt = $binding->recordPresence($command->report);

        $binding->host->recordDescriptors(
            $command->report->protocol,
            array_map(
                fn (EnrolledDescriptor $descriptor) => $descriptor->stored(),
                $this->enrollment->enroll($command->report->descriptors),
            ),
        );

        return $receipt;
    }
}
