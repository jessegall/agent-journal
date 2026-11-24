<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Communication\AcknowledgeMessageBatchCall;
use App\Calls\Communication\MessageBatchAcknowledged;
use App\Commands\Messages\AcknowledgeMessageBatch\AcknowledgeMessageBatchCommand;
use App\Contracts\Bus\CommandBus;

/**
 * Confirms the pieces of a message batch your driver showed.
 */
final readonly class AcknowledgeMessageBatchController
{
    public function __invoke(AcknowledgeMessageBatchCall $call, CommandBus $commands): MessageBatchAcknowledged
    {
        $confirmed = $commands->run(new AcknowledgeMessageBatchCommand(
            $call->batchId,
            $call->handles,
            $call->contextKey,
        ));

        return MessageBatchAcknowledged::from(['batchId' => $call->batchId, 'confirmed' => $confirmed]);
    }
}
