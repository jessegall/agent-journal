<?php

declare(strict_types=1);

namespace App\Connections\Handlers;

use App\Connections\Commands\RecordBindingPresence;
use App\Connections\Exceptions\PresenceRefused;
use App\Connections\Models\ProjectBinding;
use App\Connections\Values\PresenceReceipt;
use App\Contracts\CommandHandler;

/**
 * Locks the binding, refuses a report from any host but its own or for a revoked binding, and records the report.
 */
final readonly class RecordBindingPresenceHandler implements CommandHandler
{
    public function handle(RecordBindingPresence $command): PresenceReceipt
    {
        $binding = ProjectBinding::lockById($command->bindingId);

        if (! $binding->isReportableBy($command->hostId)) {
            throw PresenceRefused::notTheHost($binding->id);
        }

        return $binding->recordPresence($command->report);
    }
}
