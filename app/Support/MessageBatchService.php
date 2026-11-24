<?php

declare(strict_types=1);

namespace App\Support;

use App\Commands\ReplyToMessage\ReplyToMessageCommand;
use App\Contracts\Actors\ActorAttention;
use App\Contracts\Actors\ActorLabels;
use App\Contracts\Actors\AgentTexts;
use App\Contracts\Chat\InboxResolver;
use App\Contracts\Sessions\CurrentSession;
use App\Data\Messages\MessageBatchData;
use App\Data\Messages\MessageBatchItemData;
use App\Enums\MessageBatchState;
use App\Exceptions\ChatStateConflict;
use App\Mcp\Support\McpCatalogue;
use App\Mcp\Tools\MessageBatchAcknowledgeTool;
use App\Models\Agents\AgentRuntime;
use App\Models\Chats\InboxInterval;
use App\Models\Chats\SpeechOpportunity;
use App\Models\Chats\TimelineEvent;
use App\Models\Drivers\DriverTurn;
use App\Models\Messages\Message;
use App\Models\Messages\MessageBatch;
use App\Models\Messages\MessageRange;
use App\Models\Messages\MessageReceipt;
use App\Models\Messages\OutstandingMessageRange;
use App\Models\Messages\ReceiptDelivery;
use App\Models\Messages\ReceiptProgress;
use App\Values\AgentText;
use Carbon\CarbonImmutable;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/**
 * The messages an agent is shown in one go, a message batch, from making it to settling it. Making: the unread chat
 * text of the agent's session, each message labelled by its speaker and cut to what fits, a long one in pieces, a
 * message range each. Text: what the driver is shown, each message fenced, a user's as a request and an agent's as its
 * words, with the one line it takes to answer; how the chat works is said once to a driver context. Confirming: the
 * agent confirms pieces by their handles, or answers under a user message, which confirms what came with it; a message
 * is shown once its whole body is confirmed, and its delivery is settled. Sweeping: a batch whose lease ran out with
 * no word is settled, and what it left unconfirmed is tried again or given up with its reason.
 */
final readonly class MessageBatchService
{
    public const int POST_LIMIT = 20;

    public const int CHARACTER_LIMIT = 8000;

    public const int LEASE_SECONDS = 120;

    private const int HANDLE_BYTES = 24;

    /**
     * The most batches one answer confirms: the ones that showed its user message, again after each lost lease.
     */
    private const int BATCH_LIMIT = 20;

    public const int ALLOWED_FAILURES = 5;

    private const int PASS_LIMIT = 100;

    public function __construct(
        private InboxResolver $inboxes,
        private ActorLabels $labels,
        private McpCatalogue $tools,
        private CurrentSession $session,
        private ConnectionInterface $database,
        private ActorAttention $attention,
        private AgentTexts $texts,
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
    ): MessageBatchData|null {
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

        $batch = MessageBatch::create(
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

        $posts = $pending->take(self::POST_LIMIT);

        $messages = Message::query()->acrossInboxes()
            ->whereKey(array_values($posts->map(fn (MessageReceipt $receipt) => $receipt->message_id)->all()))
            ->readExactly($posts->count())
            ->get()
            ->keyBy('id');

        foreach ($posts as $receipt) {
            $message = $messages->get(
                $receipt->message_id,
                fn () => throw new ModelNotFoundException()->setModel(Message::class, [$receipt->message_id]),
            );

            $item = $this->itemOf($batch, $receipt, $message, $agent, $contextKey, $budget, false);

            if ($item === null) {
                break;
            }

            $items[] = $item;
            $budget -= $item->endOffset - $item->startOffset;
            $shown++;
        }

        $grant = null;

        if (array_any($items, fn (MessageBatchItemData $item) => $item->claimableRootId !== null)) {
            $grant = bin2hex(random_bytes(self::HANDLE_BYTES));
            $batch->grantClaims(hash('sha256', $grant));
        }

        return MessageBatchData::from([
            'claimGrant' => $grant,
            'batchId' => $batch->id,
            'inboxId' => $locked->inbox_id,
            'inboxLabel' => $this->inboxes->resolve($locked->inbox_id)->inboxLabel(),
            'items' => $items,
            'hasMore' => $pending->count() > $shown,
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
     * Whether a chat the agent is in still holds text it was not shown, without making a batch for it.
     */
    public function hasUnshownText(ActorIdentity $agent): bool
    {
        return $this->nextInterval($agent) !== null;
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

        return $intervals->sortBy(fn (InboxInterval $interval) => (string) MessageBatch::query()
            ->where('interval_id', $interval->id)
            ->max('dispatched_at'))->first();
    }

    /**
     * The piece of the post this batch carries: from the context's confirmed offset, as much as the budget allows.
     */
    private function itemOf(
        MessageBatch $batch,
        MessageReceipt $receipt,
        Message $message,
        ActorIdentity $agent,
        string $contextKey,
        int $budget,
        bool $isReference,
    ): MessageBatchItemData|null {
        $start = ReceiptProgress::confirmedOffsetOf($receipt->id, $contextKey);
        $length = mb_strlen($message->body);
        $take = min($length - $start, $budget);

        if ($take <= 0 && $length > 0) {
            return null;
        }

        $handle = bin2hex(random_bytes(self::HANDLE_BYTES));
        $end = $start + max($take, 0);

        $outstanding = OutstandingMessageRange::waitingAt($receipt, $start)
            ?? OutstandingMessageRange::create($receipt, $start);

        MessageRange::create($batch, $outstanding, $end, hash('sha256', $handle));

        $author = $message->author;
        $root = $message->user_root_id;
        $claimable = $root !== null && SpeechOpportunity::query()->onRoot($root)->openFor($agent)->exists();

        return MessageBatchItemData::from([
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
            'isFromUser' => $author->type->isUser(),
        ]);
    }

    public function textFor(AgentRuntime $runtime, CarbonImmutable $at): string|null
    {
        $contextKey = self::contextOf($runtime);

        $batch = $this->next(
            ActorIdentity::of($runtime->session->agent),
            $runtime->agent_session_id,
            $runtime->process_generation,
            $contextKey,
            $at,
        );

        if ($batch === null || $batch->items === []) {
            return null;
        }

        return $this->render($batch, $contextKey);
    }

    public static function contextOf(AgentRuntime $runtime): string
    {
        return "runtime:{$runtime->id}:{$runtime->process_generation}";
    }

    private function render(MessageBatchData $batch, string $contextKey): string
    {
        $items = implode("\n\n", array_map(fn (MessageBatchItemData $item) => $this->itemText($item), $batch->items));
        $more = $batch->hasMore ? "\n".$this->texts->render(AgentText::of('core.chat.more')) : '';
        $new = $this->texts->render(AgentText::of('core.chat.new', ['inbox' => $batch->inboxLabel, 'items' => $items]));

        return $new.$more.$this->confirmation($batch, $contextKey);
    }

    /**
     * How the agent confirms a batch none of whose messages it may answer; an answer confirms its own batch.
     */
    private function confirmation(MessageBatchData $batch, string $contextKey): string
    {
        if (array_any($batch->items, fn (MessageBatchItemData $item) => $item->claimableRootId !== null)) {
            return '';
        }

        $handles = implode(', ', array_map(fn (MessageBatchItemData $item) => $item->handle, $batch->items));

        return "\n".$this->texts->render(AgentText::of('core.chat.confirm', [
            'tool' => MessageBatchAcknowledgeTool::NAME,
            'batch' => $batch->batchId,
            'context' => $contextKey,
            'handles' => $handles,
        ]));
    }

    private function itemText(MessageBatchItemData $item): string
    {
        $label = $item->isReference
            ? $this->texts->render(AgentText::of('core.chat.earlier', ['speaker' => $item->speakerLabel]))
            : $item->speakerLabel;

        if ($item->endOffset < $item->bodyLength || $item->startOffset > 0) {
            $label = $this->texts->render(AgentText::of('core.chat.part', [
                'speaker' => $label,
                'start' => $item->startOffset,
                'end' => $item->endOffset,
                'length' => $item->bodyLength,
            ]));
        }

        $answer = $item->claimableRootId === null || $item->isReference
            ? ''
            : "\n".$this->texts->render(AgentText::of('core.chat.answer_with', [
                'tool' => $this->replyTool(),
                'message' => $item->messageId,
            ]));

        return "{$label}:\n```{$item->fence()}\n{$item->body}\n```{$answer}";
    }

    /**
     * The tool an agent answers a message with, as the installed journal names it.
     */
    private function replyTool(): string
    {
        return $this->tools->toolNameDispatching(ReplyToMessageCommand::class);
    }

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
        $batch = MessageBatch::query()->whereKey($batchId)->first();

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
        $locked = MessageBatch::lockedById($batch->id);

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

        // A confirmed batch that leaves text unshown asks for the next wake, which the host claims once the turn ends.
        if ($changed > 0 && $this->hasUnshownText($agent)) {
            $this->attention->request($agent, AttentionOrigin::confirmedBatch($locked->id));
        }

        return $changed;
    }

    /**
     * Confirms one of the batch's pieces by its handle digest: the piece, its outstanding range and the context's
     * progress move together. Answers the piece this confirmation changed, or null when it changed nothing.
     *
     * @throws ChatStateConflict
     */
    public function confirm(MessageBatch $batch, string $handleDigest, CarbonImmutable $at): MessageRange|null
    {
        if ($batch->state->isSettled()) {
            throw ChatStateConflict::batchSettled($batch->id);
        }

        $range = $batch->rangeWithDigest($handleDigest);

        if ($range === null || ! $this->confirmRange($batch, $range, $at)) {
            return null;
        }

        return $range;
    }

    /**
     * Confirms everything the agent's own session was shown in the batches that carried the user message, a batch
     * whose lease ran out while the agent worked too: an agent that answers under the message has read what came
     * with it, so its answer needs no confirmation of its own.
     */
    public function acknowledgeShownUnder(string $rootId, string $intervalId, CarbonImmutable $at): void
    {
        if (! $this->session->hasSession()) {
            return;
        }

        $batches = MessageBatch::query()
            ->shownUnderRoot($this->session->sessionId(), $intervalId, $rootId)
            ->lockForUpdate()
            ->limit(self::BATCH_LIMIT)
            ->get();

        foreach ($batches as $batch) {
            $ranges = $batch->ranges()->whereNull('confirmed_at')->with('outstanding')
                ->limit(self::POST_LIMIT + 1)->get();

            foreach ($ranges as $range) {
                $this->confirmRange($batch, $range, $at);
                $this->presentWhenWhole($range->receipt_id, $batch->context_key, $at);
            }
        }
    }

    /**
     * Confirms one piece: the piece, its outstanding range and the context's progress move together. Answers whether
     * this confirmation changed it.
     */
    private function confirmRange(MessageBatch $batch, MessageRange $range, CarbonImmutable $at): bool
    {
        if (! $range->confirm($at)) {
            return false;
        }

        $range->outstanding->confirm();

        $progress = ReceiptProgress::findFor($range->receipt_id, $batch->context_key)
            ?? ReceiptProgress::create($range->receipt_id, $batch->context_key);

        $progress->advanceTo($range->end_offset);
        $batch->recordProgress($at);

        return true;
    }

    private function isOwnSession(MessageBatch $batch): bool
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

        if (ReceiptProgress::confirmedOffsetOf($receiptId, $contextKey) >= $length && $receipt->present($at)) {
            ReceiptDelivery::undeliveredFor($receiptId)?->settleShown();
        }
    }

    public function sweep(CarbonImmutable $at): void
    {
        $batchIds = MessageBatch::query()
            ->where('state', MessageBatchState::Dispatched)
            ->orderBy('dispatched_at')
            ->limit(self::PASS_LIMIT)
            ->pluck('id')
            ->all();

        foreach ($batchIds as $batchId) {
            $this->database->transaction(fn () => $this->settleOne((string) $batchId, $at));
        }
    }

    private function settleOne(string $batchId, CarbonImmutable $at): void
    {
        $batch = MessageBatch::query()->whereKey($batchId)->lockForUpdate()->first();

        if ($batch === null || $batch->state->isSettled()) {
            return;
        }

        $turnEnded = $batch->driver_turn_id !== null
            && DriverTurn::query()->whereKey($batch->driver_turn_id)->whereNotNull('finished_at')->exists();

        $leaseRanOut = $batch->last_progress_at->addSeconds(MessageBatchService::LEASE_SECONDS)->lessThan($at);

        if (! $turnEnded && ! $leaseRanOut) {
            return;
        }

        $unconfirmed = $batch->ranges()->whereNull('confirmed_at')->with('outstanding')->get();

        if ($unconfirmed->isEmpty()) {
            $batch->settle(MessageBatchState::Confirmed, $at);

            return;
        }

        $batch->settle($turnEnded ? MessageBatchState::Failed : MessageBatchState::Expired, $at);

        foreach ($unconfirmed as $range) {
            $this->countFailure($range->outstanding, $turnEnded ? 'turn ended unconfirmed' : 'no confirmation in time');
        }
    }

    private function countFailure(OutstandingMessageRange $range, string $reason): void
    {
        $range->recordFailure();

        if ($range->consecutive_failures >= self::ALLOWED_FAILURES) {
            $range->exhaust($reason);
        }
    }
}
