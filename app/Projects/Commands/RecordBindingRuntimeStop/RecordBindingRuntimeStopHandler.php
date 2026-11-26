<?php

declare(strict_types=1);

namespace App\Projects\Commands\RecordBindingRuntimeStop;

use App\Bus\Contracts\CommandHandler;
use App\Models\Projects\ProjectBinding;
use App\Projects\Exceptions\PresenceRefused;

/**
 * Locks the binding, refuses a receipt from any host but its own, and takes the receipt.
 */
final readonly class RecordBindingRuntimeStopHandler implements CommandHandler
{
    public function handle(RecordBindingRuntimeStopCommand $command): void
    {
        $binding = ProjectBinding::findLockedById($command->bindingId);

        if ($binding->host_id !== $command->hostId) {
            throw PresenceRefused::notTheHost($binding->id);
        }

        $binding->confirmStop($command->runtimeId);
    }
}
