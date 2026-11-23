<?php

declare(strict_types=1);

namespace App\Commands\AcknowledgeMessageBatch;

use App\Contracts\Bus\CommandHandler;
use App\Support\ActorIdentity;
use App\Support\MessageBatchService;
use Carbon\CarbonImmutable;

final readonly class AcknowledgeMessageBatchHandler implements CommandHandler
{
    public function __construct(private MessageBatchService $acknowledgement) {}

    public function handle(AcknowledgeMessageBatchCommand $command): int
    {
        return $this->acknowledgement->acknowledge(
            $command->batchId,
            $command->handles,
            $command->contextKey,
            ActorIdentity::of($command->dispatchedBy()),
            CarbonImmutable::now(),
        );
    }
}
