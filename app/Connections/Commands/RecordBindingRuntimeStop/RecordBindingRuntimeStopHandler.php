<?php

declare(strict_types=1);

namespace App\Connections\Commands\RecordBindingRuntimeStop;

use App\Connections\Exceptions\PresenceRefused;
use App\Connections\Models\ProjectBinding;
use App\Contracts\CommandHandler;

/**
 * Locks the binding, refuses a receipt from any host but its own, and takes the receipt.
 */
final readonly class RecordBindingRuntimeStopHandler implements CommandHandler
{
    public function handle(RecordBindingRuntimeStopCommand $command): void
    {
        $binding = ProjectBinding::lockById($command->bindingId);

        if ($binding->host_id !== $command->hostId) {
            throw PresenceRefused::notTheHost($binding->id);
        }

        $binding->confirmStop($command->runtimeId);
    }
}
