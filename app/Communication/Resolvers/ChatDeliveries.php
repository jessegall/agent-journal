<?php

declare(strict_types=1);

namespace App\Communication\Resolvers;

use App\Communication\Data\DeliveryView;
use App\Communication\Enums\OutstandingRangeState;
use App\Communication\Enums\WakeState;
use App\Communication\Models\MessageReceipt;
use App\Communication\Models\OutstandingRange;
use App\Communication\Models\ReceiptDelivery;

/**
 * Per recipient, how far waking it about each of some chat messages got: pending, waiting for it to start, accepted,
 * or given up with the reason and the piece of text still waiting. Only recipients that are woken have a delivery.
 */
final readonly class ChatDeliveries
{
    /**
     * @param  list<string>  $messageIds
     * @return array<string, list<DeliveryView>>  the deliveries of each message, keyed by message id
     */
    public function forMessages(array $messageIds): array
    {
        if ($messageIds === []) {
            return [];
        }

        $receipts = MessageReceipt::query()->with('interval')->whereIn('message_id', $messageIds)->get()->keyBy('id');
        $receiptIds = $receipts->keys()->all();
        $deliveries = ReceiptDelivery::query()->whereIn('receipt_id', $receiptIds)->get();
        $exhausted = OutstandingRange::query()
            ->whereIn('receipt_id', $receiptIds)
            ->where('state', OutstandingRangeState::Exhausted)
            ->orderBy('start_offset')
            ->get()
            ->keyBy('receipt_id');

        $views = [];

        foreach ($deliveries as $delivery) {
            $receipt = $receipts->get($delivery->receipt_id);
            $range = $exhausted->get($delivery->receipt_id);
            $state = $range === null ? $delivery->state->wakeState() : WakeState::Exhausted;

            $views[$receipt->message_id][] = new DeliveryView(
                $receipt->message_id,
                $receipt->interval->actor,
                $state,
                $state === WakeState::Exhausted ? $range?->exhausted_reason ?? $delivery->last_failure : null,
                $range?->start_offset,
                $range?->id,
            );
        }

        return $views;
    }
}
