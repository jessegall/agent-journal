<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Chat\InboxResolver;
use App\Contracts\Sessions\CurrentSession;
use App\Exceptions\ChatStateConflict;
use App\Models\InboxInterval;
use App\Models\Message;
use App\Models\MessageReceipt;
use App\Models\PresentationBatch;
use App\Models\PresentationRange;
use App\Models\ReceiptProgress;
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
        $locked = PresentationBatch::lockedById($batch->id);

        $changed = 0;
        $receiptIds = [];

        foreach ($handles as $handle) {
            $range = $locked->state->isSettled() ? null : $this->confirm($locked, hash('sha256', $handle), $at);

            if ($range === null) {
                continue;
            }

            $changed++;
            $receiptIds[] = $range->receipt_id;
        }

        foreach (array_unique($receiptIds) as $receiptId) {
            $this->presentWhenWhole($receiptId, $contextKey, $at);
        }

        return $changed;
    }

    /**
     * Confirms one of the batch's pieces by its handle digest: the piece, its outstanding range and the context's
     * progress move together. Answers the piece this confirmation changed, or null when it changed nothing.
     *
     * @throws ChatStateConflict
     */
    public function confirm(PresentationBatch $batch, string $handleDigest, CarbonImmutable $at): PresentationRange|null
    {
        if ($batch->state->isSettled()) {
            throw ChatStateConflict::batchSettled($batch->id);
        }

        $range = $batch->rangeWithDigest($handleDigest);

        if ($range === null || ! $range->confirm($at)) {
            return null;
        }

        $range->outstanding->confirm();

        $progress = ReceiptProgress::findFor($range->receipt_id, $batch->context_key)
            ?? ReceiptProgress::create($range->receipt_id, $batch->context_key);

        $progress->advanceTo($range->end_offset);
        $batch->recordProgress($at);

        return $range;
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

        if (ReceiptProgress::confirmedOffsetOf($receiptId, $contextKey) >= $length) {
            $receipt->present($at);
        }
    }
}
