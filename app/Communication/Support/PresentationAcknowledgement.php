<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\CurrentSession;
use App\Communication\Contracts\InboxResolver;
use App\Communication\Models\InboxInterval;
use App\Communication\Models\Message;
use App\Communication\Models\MessageReceipt;
use App\Communication\Models\PresentationBatch;
use App\Communication\Models\ReceiptProgress;
use Carbon\CarbonImmutable;

/**
 * An agent's confirmation that its driver showed pieces of a batch: checked under the chat inbox's lock against the
 * batch's session, driver context and interval, which must still be the agent's active one. Each confirmed piece
 * moves that context's progress, and a body is presented only when the context has confirmed it from the first
 * character to the last. A handle of another batch, context or interval changes nothing; no wake follows.
 */
final readonly class PresentationAcknowledgement
{
    public function __construct(
        private InboxResolver $inboxes,
        private CurrentSession $session,
    ) {}

    /**
     * @param  list<string>  $handles
     */
    public function acknowledge(
        string $batchId,
        array $handles,
        string $contextKey,
        ActorIdentity $agent,
        CarbonImmutable $at,
    ): int {
        $batch = PresentationBatch::query()->whereKey($batchId)->first();

        if ($batch === null || $batch->context_key !== $contextKey || ! $this->isOwnSession($batch)) {
            return 0;
        }

        $interval = InboxInterval::query()
            ->whereKey($batch->interval_id)
            ->heldBy($agent)
            ->whereNull('left_at')
            ->first();

        if ($interval === null) {
            return 0;
        }

        $inbox = $this->inboxes->resolve($interval->inbox_id);
        $this->inboxes->accessFor($inbox)->lockExclusive($inbox);
        $locked = PresentationBatch::query()->whereKey($batch->id)->lockForUpdate()->firstOrFail();

        $changed = 0;
        $receiptIds = [];

        foreach ($handles as $handle) {
            $digest = hash('sha256', $handle);

            if ($locked->state->isSettled() || ! $locked->confirmRange($digest, $at)) {
                continue;
            }

            $changed++;
            $receiptIds[] = (string) $locked->ranges()->where('handle_digest', $digest)->value('receipt_id');
        }

        foreach (array_unique($receiptIds) as $receiptId) {
            $this->presentWhenWhole($receiptId, $contextKey, $at);
        }

        return $changed;
    }

    private function isOwnSession(PresentationBatch $batch): bool
    {
        return $this->session->hasSession() && $this->session->sessionId() === $batch->agent_session_id;
    }

    /**
     * Presents the receipt once this context confirmed its whole body; a part leaves it unread at its offset.
     */
    private function presentWhenWhole(string $receiptId, string $contextKey, CarbonImmutable $at): void
    {
        $receipt = MessageReceipt::query()->findOrFail($receiptId);
        $length = mb_strlen(Message::query()->acrossInboxes()->findOrFail($receipt->message_id)->body);

        if (ReceiptProgress::of($receiptId, $contextKey)->confirmed_offset >= $length) {
            $receipt->present($at);
        }
    }
}
