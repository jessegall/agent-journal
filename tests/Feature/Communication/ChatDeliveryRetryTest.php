<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Actors\Enums\ChatPermission;
use App\Actors\Support\ActorIdentity;
use App\Agents\Support\AgentChatAccess;
use App\Communication\Commands\PostChatMessage;
use App\Communication\Commands\RetryDelivery;
use App\Communication\Enums\OutstandingRangeState;
use App\Communication\Enums\ReceiptDeliveryState;
use App\Communication\Enums\WakeState;
use App\Communication\Models\MessageReceipt;
use App\Communication\Models\OutstandingRange;
use App\Communication\Models\ReceiptDelivery;
use Carbon\CarbonImmutable;
use Domain\Access\Models\EnvironmentUserGrant;
use Domain\Access\Models\User;
use Domain\Chat\Commands\AddChatParticipant;
use Domain\Chat\Commands\CreateGroupChat;
use Domain\Chat\Data\ChatMessageData;
use Domain\Chat\Resolvers\Support\ChatConversations;
use Tests\Support\MessagingTestCase;
use Throwable;

/**
 * Ada's post in Design reaches Bea, the builder and the reviewer; the builder's delivery is given up. Ada sees which
 * recipient and from which character, her retry asks again for only that delivery under its key, and Bea, who is no
 * operator, is offered no retry and refused when she posts one.
 */
final class ChatDeliveryRetryTest extends MessagingTestCase
{
    public function test_an_operator_retries_only_the_given_up_delivery_and_a_member_is_refused(): void
    {
        $bea = User::factory()->create(['name' => 'Bea']);
        EnvironmentUserGrant::grant(
            $bea,
            null,
            [ChatPermission::ReceiveInvitations],
            ActorIdentity::of($this->owner),
            CarbonImmutable::now(),
        );
        $this->inboxOf(ActorIdentity::of($bea));
        $access = $this->app->make(AgentChatAccess::class);
        foreach ([$this->builder, $this->reviewer] as $agent) {
            $access->allow($agent->agent_id, null, [$this->owner->id], ActorIdentity::system(), CarbonImmutable::now());
        }

        $this->asOwner();
        $inboxId = $this->runOnBus(new CreateGroupChat('Design', [$bea->id]));
        $this->runOnBus(new AddChatParticipant($inboxId, "agent:{$this->builder->agent_id}"));
        $this->runOnBus(new AddChatParticipant($inboxId, "agent:{$this->reviewer->agent_id}"));
        $messageId = $this->runOnBus(new PostChatMessage($inboxId, 'Plan?', 'ada-plan'));

        $builderReceipt = $this->receiptOf($messageId, $this->builder->agent_id);
        $range = OutstandingRange::at($builderReceipt, 8000);
        $range->exhaust('The driver did not answer.');
        $delivery = ReceiptDelivery::query()->where('receipt_id', $builderReceipt->id)->sole();
        $delivery->exhaust('The driver did not answer.');
        $reviewerState = ReceiptDelivery::query()
            ->where('receipt_id', $this->receiptOf($messageId, $this->reviewer->agent_id)->id)
            ->sole()
            ->state;

        $row = $this->rowOf($inboxId, $messageId);
        $given = array_values(array_filter($row->deliveries, fn ($shown) => $shown->state === WakeState::Exhausted));
        $this->assertCount(1, $given);
        $this->assertSame("agent:{$this->builder->agent_id}", $given[0]->recipient);
        $this->assertSame(8000, $given[0]->pendingFrom);
        $this->assertTrue($row->actions->retryDelivery);

        $this->runOnBus(new RetryDelivery($range->id));

        $this->assertSame(OutstandingRangeState::Outstanding, $range->refresh()->state);
        $this->assertSame(ReceiptDeliveryState::Pending, $delivery->refresh()->state);
        $this->assertSame($builderReceipt->id, $delivery->notification_key);
        $this->assertSame($reviewerState, ReceiptDelivery::query()
            ->where('receipt_id', $this->receiptOf($messageId, $this->reviewer->agent_id)->id)
            ->sole()
            ->state);

        $this->startUserRequestAs($bea->id);
        $this->assertFalse($this->rowOf($inboxId, $messageId)->actions->retryDelivery);
        $this->assertThrows(fn () => $this->runOnBus(new RetryDelivery($range->id)), Throwable::class);
    }

    private function receiptOf(string $messageId, string $agentId): MessageReceipt
    {
        return MessageReceipt::query()
            ->where('message_id', $messageId)
            ->whereIn('interval_id', fn ($intervals) => $intervals
                ->select('id')
                ->from('inbox_intervals')
                ->where('actor_id', $agentId))
            ->sole();
    }

    private function rowOf(string $inboxId, string $messageId): ChatMessageData
    {
        $this->app->forgetScopedInstances();
        $rows = $this->app->make(ChatConversations::class)->rowsPage($inboxId, null)->messages;

        return array_values(array_filter($rows, fn (ChatMessageData $row) => $row->id === $messageId))[0];
    }
}
