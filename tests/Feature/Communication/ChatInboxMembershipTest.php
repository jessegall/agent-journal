<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Contracts\Chat\ConversationResolver;
use App\Contracts\Chat\InboxResolver;
use App\Data\InboxView;
use App\Enums\LeaveReason;
use App\Exceptions\InboxUnavailable;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Support\ChatInboxes;
use App\Support\InboxIntervals;
use App\Support\RegisteredInboxes;
use Domain\Chat\Models\Conversation;
use Tests\Support\MessagingTestCase;
use Tests\Support\OpensPairChats;

/**
 * A chat inbox is one of its members' inboxes beside their desk inbox, labelled by the other side of a direct chat,
 * until the member leaves; a non-member's membership is refused as a missing inbox.
 */
final class ChatInboxMembershipTest extends MessagingTestCase
{
    use OpensPairChats;

    private Conversation $chat;

    protected function setUp(): void
    {
        parent::setUp();

        $this->chat = $this->pairChat(ActorIdentity::of($this->owner), $this->actorOf($this->builder));
    }

    public function test_the_owner_lists_the_chat_beside_its_desk_inbox_under_the_agents_name(): void
    {
        $this->asOwner();

        $inboxes = $this->app->make(ConversationResolver::class)->ownInboxes();
        $labels = array_column(array_map(fn (InboxView $inbox) => [$inbox->inboxId, $inbox->label], $inboxes), 1, 0);

        $this->assertArrayHasKey($this->ownerInboxId(), $labels);
        $this->assertSame('Builder', $labels[$this->chat->inbox_id]);
    }

    public function test_a_member_who_left_no_longer_holds_the_chat_inbox(): void
    {
        $builder = $this->actorOf($this->builder);
        $inbox = $this->app->make(InboxResolver::class)->resolve($this->chat->inbox_id);
        $inboxes = $this->app->make(RegisteredInboxes::class);

        $this->assertContains($this->chat->inbox_id, $inboxes->inboxIdsOf($builder)->pluck('inbox_id')->all());

        $interval = $this->app->make(ChatInboxes::class)->activeInterval($inbox, $builder);
        $this->app->make(InboxIntervals::class)->leave($interval, LeaveReason::Left);

        $this->assertNotContains($this->chat->inbox_id, $inboxes->inboxIdsOf($builder)->pluck('inbox_id')->all());
        $this->expectException(InboxUnavailable::class);
        $inboxes->accessFor($inbox)->membership($inbox, ActorContext::forAgent($builder->id));
    }

    public function test_joining_twice_keeps_one_interval_and_one_joined_event(): void
    {
        $builder = $this->actorOf($this->builder);
        $inbox = $this->app->make(InboxResolver::class)->resolve($this->chat->inbox_id);
        $first = $this->app->make(ChatInboxes::class)->activeInterval($inbox, $builder);

        $again = $this->app->make(InboxIntervals::class)->enter($inbox, $builder, $first->role);

        $this->assertSame($first->intervalId, $again->intervalId);
        $this->assertCount(2, $this->app->make(ChatInboxes::class)->activeIntervals($inbox));
    }
}
