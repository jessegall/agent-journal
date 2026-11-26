<?php

declare(strict_types=1);

namespace App\Projects\Commands\RecordBindingPresence;

use App\Bus\Contracts\CommandHandler;
use App\Models\Projects\ProjectBinding;
use App\Projects\Exceptions\PresenceRefused;
use App\Projects\Values\PresenceReceipt;

/**
 * Locks the binding, refuses a report from any host but its own or for a revoked binding, and records the report on the
 * binding.
 */
final readonly class RecordBindingPresenceHandler implements CommandHandler
{
    public function handle(RecordBindingPresenceCommand $command): PresenceReceipt
    {
        $binding = ProjectBinding::findLockedById($command->bindingId);

        if (! $binding->isReportableBy($command->hostId)) {
            throw PresenceRefused::notTheHost($binding->id);
        }

        return $binding->recordPresence($command->report);
    }
}
