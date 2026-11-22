<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Actors\Contracts\ActorLabels;
use App\Actors\Support\ActorIdentity;
use App\Communication\Contracts\InboxResolver;
use App\Communication\Data\PresentationBatchData;
use App\Communication\Data\PresentationItemData;
use App\Communication\Models\InboxInterval;
use App\Communication\Models\Message;
use App\Communication\Models\MessageReceipt;
use App\Communication\Models\OutstandingRange;
use App\Communication\Models\PresentationBatch;
use App\Communication\Models\PresentationRange;
use App\Communication\Models\ReceiptProgress;
use App\Communication\Models\SpeechOpportunity;
use App\Communication\Models\TimelineEvent;
use Carbon\CarbonImmutable;

/**
 * The next bounded batch of unread chat text for an agent's driver: one chat at a time, taking turns between the
 * chats with pending text so none starves another, at most twenty posts and eight thousand characters, a long body
 * split into pieces from where this driver context last confirmed it. Each piece gets a fresh opaque handle; only its
 * digest is kept.
 */
final readonly class PresentationBatches
{
    public const int POST_LIMIT = 20;

    public const int CHARACTER_LIMIT = 8000;

    public const int LEASE_SECONDS = 120;

    private const int HANDLE_BYTES = 24;

    public function __construct(
        private InboxResolver $inboxes,
        private ActorLabels $labels,
    ) {}

    /**
     * The batch for the agent's session in the context, or none when no chat of it has unread text.
     */
    public function next(
        ActorIdentity $agent,
        string $sessionId,
        int $runtimeGeneration,
        string $contextKey,
        CarbonImmutable $at,
    ): PresentationBatchData|null {
        $interval = $this->nextInterval($agent);

        if ($interval === null) {
            return null;
        }

        $locked = InboxInterval::query()->whereKey($interval->id)->whereNull('left_at')->lockForUpdate()->first();

        if ($locked === null) {
            return null;
        }

        $pending = MessageReceipt::query()
            ->ofInterval($locked->id)
            ->notPresented()
            ->with(['message' => fn ($messages) => $messages->acrossInboxes()])
            ->limit(self::POST_LIMIT + 1)
            ->get()
            ->sortBy(fn (MessageReceipt $receipt) => $receipt->message?->timeline_event_id)
            ->values();

        $batch = PresentationBatch::create(
            $locked->id,
            $sessionId,
            $runtimeGeneration,
            $contextKey,
            1,
            $at,
            $at->addSeconds(self::LEASE_SECONDS),
        );

        $items = [];
        $budget = self::CHARACTER_LIMIT;
        $shown = 0;

        $reference = $this->parentReference(
            $pending->first(),
            $locked,
            array_values($pending->map(fn (MessageReceipt $receipt) => $receipt->message_id)->all()),
        );

        if ($reference !== null) {
            $item = $this->itemOf($batch, $reference[0], $reference[1], $agent, $contextKey, $budget, true);

            if ($item !== null) {
                $items[] = $item;
                $budget -= $item->endOffset - $item->startOffset;
            }
        }

        foreach ($pending->take(self::POST_LIMIT) as $receipt) {
            $message = Message::query()->acrossInboxes()->findOrFail($receipt->message_id);
            $item = $this->itemOf($batch, $receipt, $message, $agent, $contextKey, $budget, false);

            if ($item === null) {
                break;
            }

            $items[] = $item;
            $budget -= $item->endOffset - $item->startOffset;
            $shown++;
        }

        $grant = null;

        if (array_any($items, fn (PresentationItemData $item) => $item->claimableRootId !== null)) {
            $grant = bin2hex(random_bytes(self::HANDLE_BYTES));
            $batch->grantClaims(hash('sha256', $grant));
        }

        return PresentationBatchData::from([
            'claimGrant' => $grant,
            'batchId' => $batch->id,
            'inboxId' => $locked->inbox_id,
            'inboxLabel' => $this->inboxes->resolve($locked->inbox_id)->inboxLabel(),
            'items' => $items,
            'more' => $pending->count() > $shown,
        ]);
    }

    private function sequenceOf(Message $message): int
    {
        return (int) TimelineEvent::query()->whereKey($message->timeline_event_id)->value('sequence');
    }

    /**
     * The visible post the first pending one replies to, shown first as a labelled reference when it is not itself
     * pending; a parent the interval never received stays hidden.
     *
     * @param  list<string>  $pendingIds
     * @return array{MessageReceipt, Message}|null
     */
    private function parentReference(
        MessageReceipt|null $first,
        InboxInterval $interval,
        array $pendingIds,
    ): array|null {
        $parentId = $first?->message?->reply_to_id;

        if ($parentId === null || in_array($parentId, $pendingIds, true)) {
            return null;
        }

        $receipt = MessageReceipt::query()->ofInterval($interval->id)->where('message_id', $parentId)->first();

        if ($receipt === null) {
            return null;
        }

        return [$receipt, Message::query()->acrossInboxes()->findOrFail($parentId)];
    }

    /**
     * The agent's chat whose turn it is: of those with unread text, the one presented longest ago, or never.
     */
    private function nextInterval(ActorIdentity $agent): InboxInterval|null
    {
        $intervals = InboxInterval::query()
            ->whereNull('left_at')
            ->heldBy($agent)
            ->whereIn('id', MessageReceipt::query()->notPresented()->select('interval_id'))
            ->get();

        return $intervals->sortBy(fn (InboxInterval $interval) => (string) PresentationBatch::query()
            ->where('interval_id', $interval->id)
            ->max('dispatched_at'))->first();
    }

    /**
     * The piece of the post this batch carries: from the context's confirmed offset, as much as the budget allows.
     */
    private function itemOf(
        PresentationBatch $batch,
        MessageReceipt $receipt,
        Message $message,
        ActorIdentity $agent,
        string $contextKey,
        int $budget,
        bool $isReference,
    ): PresentationItemData|null {
        $start = ReceiptProgress::confirmedOffsetOf($receipt->id, $contextKey);
        $length = mb_strlen($message->body);
        $take = min($length - $start, $budget);

        if ($take <= 0 && $length > 0) {
            return null;
        }

        $handle = bin2hex(random_bytes(self::HANDLE_BYTES));
        $end = $start + max($take, 0);
        $outstanding = OutstandingRange::waitingAt($receipt, $start) ?? OutstandingRange::create($receipt, $start);
        PresentationRange::create($batch, $outstanding, $end, hash('sha256', $handle));

        $author = $message->author();
        $root = $message->user_root_id;
        $claimable = $root !== null && SpeechOpportunity::query()->onRoot($root)->openFor($agent)->exists();

        return PresentationItemData::from([
            'messageId' => $message->id,
            'sequence' => $this->sequenceOf($message),
            'speaker' => "{$author->type->value}:{$author->id}",
            'speakerLabel' => $this->labels->labelsFor([$author])->nameOf($author) ?? $author->id,
            'isReference' => $isReference,
            'body' => mb_substr($message->body, $start, max($take, 0)),
            'startOffset' => $start,
            'endOffset' => $end,
            'bodyLength' => $length,
            'handle' => $handle,
            'claimableRootId' => $claimable ? $root : null,
        ]);
    }
}
