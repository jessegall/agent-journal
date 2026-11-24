<?php

declare(strict_types=1);

namespace App\Commands\Starts\RecordBindingStart;

use App\Contracts\Bus\CommandHandler;
use App\Models\Starts\BindingStart;

/**
 * Records the start once; the binding and start id are unique together.
 */
final readonly class RecordBindingStartHandler implements CommandHandler
{
    public function handle(RecordBindingStartCommand $command): void
    {
        BindingStart::create($command->bindingId, $command->startId, $command->sessionId, $command->runtimeId);
    }
}
