<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Commands\PostChatMessage\PostChatMessageCommand;
use App\Commands\RetryDelivery\RetryDeliveryCommand;
use App\Enums\ChatPermission;
use App\Enums\OutstandingRangeState;
use App\Enums\ReceiptDeliveryState;
use App\Enums\WakeState;
use App\Models\MessageAttention;
use App\Models\MessageReceipt;
use App\Models\OutstandingRange;
use App\Models\ReceiptDelivery;
use App\Support\ActorIdentity;
use App\Support\AgentChatAccess;
use App\Support\OutsideCommandAllowance;
use Carbon\CarbonImmutable;
use Domain\Access\Models\EnvironmentUserGrant;
use Domain\Access\Models\User;
use Domain\Chat\Commands\AddChatParticipant\AddChatParticipantCommand;
use Domain\Chat\Commands\CreateGroupChat\CreateGroupChatCommand;
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
        EnvironmentUserGrant::create(
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
        $inboxId = $this->runOnBus(new CreateGroupChatCommand('Design', [$bea->id]));
        $this->runOnBus(new AddChatParticipantCommand($inboxId, "agent:{$this->builder->agent_id}"));
        $this->runOnBus(new AddChatParticipantCommand($inboxId, "agent:{$this->reviewer->agent_id}"));
        $messageId = $this->runOnBus(new PostChatMessageCommand($inboxId, 'Plan?', 'ada-plan'));

        $builderReceipt = $this->receiptOf($messageId, $this->builder->agent_id);
        $range = OutstandingRange::create($builderReceipt, 8000);
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

        $this->runOnBus(new RetryDeliveryCommand($range->id));

        $this->assertSame(OutstandingRangeState::Outstanding, $range->refresh()->state);
        $this->assertSame(ReceiptDeliveryState::Pending, $delivery->refresh()->state);
        $this->assertSame($builderReceipt->id, $delivery->notification_key);
        $this->assertSame($reviewerState, ReceiptDelivery::query()
            ->where('receipt_id', $this->receiptOf($messageId, $this->reviewer->agent_id)->id)
            ->sole()
            ->state);

        $this->startChatMemberRequestAs($bea->id);
        $this->assertFalse($this->rowOf($inboxId, $messageId)->actions->retryDelivery);
        $this->assertThrows(fn () => $this->runOnBus(new RetryDeliveryCommand($range->id)), Throwable::class);
    }

    /**
     * The application never allows a row that raises events to be saved outside a command; the tests do, which hid
     * that a delivery tried after its message committed saved its row in no unit and so was rolled back whole.
     */
    public function test_a_post_tries_its_agent_delivery_where_no_write_outside_a_command_is_allowed(): void
    {
        $this->app->make(AgentChatAccess::class)->allow(
            $this->builder->agent_id,
            null,
            [$this->owner->id],
            ActorIdentity::system(),
            CarbonImmutable::now(),
        );
        $this->asOwner();
        $inboxId = $this->runOnBus(new CreateGroupChatCommand('Design', []));
        $this->runOnBus(new AddChatParticipantCommand($inboxId, "agent:{$this->builder->agent_id}"));
        $allowance = $this->app->make(OutsideCommandAllowance::class);
        $allowance->forbid();

        try {
            $messageId = $this->runOnBus(new PostChatMessageCommand($inboxId, 'Plan?', 'ada-plan'));
        } finally {
            $allowance->allow();
        }

        $delivery = ReceiptDelivery::query()
            ->where('receipt_id', $this->receiptOf($messageId, $this->builder->agent_id)->id)
            ->sole();

        $this->assertTrue(MessageAttention::query()->where('origin_id', $messageId)->exists());
        $this->assertTrue($delivery->state === ReceiptDeliveryState::Waiting || $delivery->lease_expires_at !== null);
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
        $rows = $this->app->make(ChatConversations::class)->rowsPage($inboxId, null)->messages;

        return array_values(array_filter($rows, fn (ChatMessageData $row) => $row->id === $messageId))[0];
    }
}
