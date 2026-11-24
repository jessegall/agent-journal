<?php

declare(strict_types=1);

namespace App\Support;

use App\Models\Messages\MessageBatch;

/**
 * The message batches dispatched to a session that wait for the turn that takes them.
 */
final readonly class WaitingBatches
{
    /**
     * Ties the batches dispatched to the session in this process generation to the turn that just started: the
     * prompt that starts a turn carries the batches the host was handed for it.
     */
    public function bindTo(string $sessionId, int $runtimeGeneration, string $driverTurnId): void
    {
        MessageBatch::query()
            ->awaitingTurn($sessionId, $runtimeGeneration)
            ->lockForUpdate()
            ->get()
            ->each(fn (MessageBatch $batch) => $batch->bindTurn($driverTurnId));
    }
}
