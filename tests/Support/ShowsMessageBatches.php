<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Commands\AcknowledgeMessageBatch\AcknowledgeMessageBatchCommand;
use App\Commands\ClaimSpeech\ClaimSpeechCommand;
use App\Contracts\Sessions\CurrentSession;
use App\Data\MessageBatchItemData;
use App\Enums\ActorType;
use App\Models\AgentSession;
use App\Support\ActorIdentity;
use App\Support\MessageBatchService;
use Carbon\CarbonImmutable;

/**
 * Presents an agent's unread chat text to its driver and confirms every piece, as a driver that showed all of it
 * would; the test runs it as that agent's session.
 */
trait ShowsMessageBatches
{
    protected function showAll(ActorIdentity $agent, string $sessionId, string $contextKey = 'thread-1'): void
    {
        $batch = $this->app->make(MessageBatchService::class)
            ->next($agent, $sessionId, 1, $contextKey, CarbonImmutable::now());

        if ($batch === null) {
            return;
        }

        $this->runOnBus(new AcknowledgeMessageBatchCommand(
            $batch->batchId,
            array_map(fn (MessageBatchItemData $item) => $item->handle, $batch->items),
            $contextKey,
        ));
    }

    /**
     * The claim the current agent session makes from the batch its turn was shown, as a driver turn does.
     */
    protected function claimSpeech(string $inboxId, string $rootId): ClaimSpeechCommand
    {
        $sessionId = $this->app->make(CurrentSession::class)->sessionId();
        $session = AgentSession::query()->findOrFail($sessionId);
        $batch = $this->app->make(MessageBatchService::class)->next(
            new ActorIdentity(ActorType::Agent, $session->agent_id),
            $sessionId,
            1,
            'claiming-turn',
            CarbonImmutable::now(),
        );

        return new ClaimSpeechCommand($inboxId, $rootId, (string) $batch?->batchId, (string) $batch?->claimGrant);
    }
}
