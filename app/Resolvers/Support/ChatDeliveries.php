<?php

declare(strict_types=1);

namespace App\Resolvers\Support;

use App\Data\Messages\DeliveryView;
use App\Enums\OutstandingMessageRangeState;
use App\Enums\WakeState;
use App\Models\Messages\MessageReceipt;
use App\Models\Messages\OutstandingMessageRange;
use App\Models\Messages\ReceiptDelivery;

/**
 * Per recipient, how far waking it about each of some chat messages got: pending, waiting for it to start, accepted,
 * or given up with the reason and the piece of text still waiting. Only recipients that are woken have a delivery.
 */
final readonly class ChatDeliveries
{
    /**
     * @param  list<string>  $messageIds
     * @return array<string, list<DeliveryView>> the deliveries of each message, keyed by message id
     */
    public function forMessages(array $messageIds): array
    {
        if ($messageIds === []) {
            return [];
        }

        $receipts = MessageReceipt::query()->with('interval')->whereIn('message_id', $messageIds)->get()->keyBy('id');
        $receiptIds = $receipts->keys()->all();
        $deliveries = ReceiptDelivery::query()->whereIn('receipt_id', $receiptIds)->get();

        $exhausted = OutstandingMessageRange::query()
            ->whereIn('receipt_id', $receiptIds)
            ->where('state', OutstandingMessageRangeState::Exhausted)
            ->orderBy('start_offset')
            ->get()
            ->keyBy('receipt_id');

        $views = [];

        foreach ($deliveries as $delivery) {
            $receipt = $receipts->get($delivery->receipt_id);
            $wake = $delivery->state->wakeState();
            // A delivery the agent accepted is delivered, whatever an earlier try left behind.
            $range = $wake === WakeState::Accepted ? null : $exhausted->get($delivery->receipt_id);
            $state = $range === null ? $wake : WakeState::Exhausted;

            $views[$receipt->message_id][] = new DeliveryView(
                $receipt->message_id,
                $receipt->interval->actor,
                $state,
                $state === WakeState::Exhausted ? $range->exhausted_reason ?? $delivery->last_failure : null,
                $range?->start_offset,
                $range?->id,
            );
        }

        return $views;
    }
}
