<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Actors\Enums\ChatPermission;
use App\Actors\Support\ActorIdentity;
use App\Communication\Commands\PostChatMessage;
use App\Communication\Enums\IntervalRole;
use App\Communication\Enums\TimelineEventType;
use App\Communication\Exceptions\InboxUnavailable;
use App\Communication\Models\TimelineEvent;
use App\Communication\Support\ChatInboxes;
use App\Communication\Support\InboxIntervals;
use Carbon\CarbonImmutable;
use Domain\Access\Models\EnvironmentUserGrant;
use Domain\Access\Models\User;
use Domain\Chat\Commands\AddChatParticipant;
use Domain\Chat\Commands\RemoveChatParticipant;
use Domain\Chat\Commands\TransferChatOwnership;
use Domain\Chat\Exceptions\ChatMembershipRefused;
use Domain\Chat\Models\Conversation;
use Domain\Chat\Support\ChatInbox;
use Illuminate\Support\Str;
use Tests\Support\MessagingTestCase;
use Tests\Support\OpensPairChats;

/**
 * Ada runs her user chat: she adds Bea and Cy, adding Bea twice makes one join, Bea cannot add anyone, the owner role
 * passes to Bea in one commit, a removed member can no longer post, and an agent chat takes nobody else.
 */
final class ChatMembershipTest extends MessagingTestCase
{
    use OpensPairChats;

    private Conversation $chat;

    private User $bea;

    private User $cy;

    protected function setUp(): void
    {
        parent::setUp();

        $this->bea = $this->grantedUser('Bea');
        $this->cy = $this->grantedUser('Cy');

        $providerId = strtolower((string) Str::ulid());
        $inboxId = $this->app->make(ChatInboxes::class)->open($providerId);
        $this->chat = Conversation::openFor($inboxId, $providerId, ActorIdentity::of($this->owner), null, 'Release');
        $this->app->make(InboxIntervals::class)
            ->join(new ChatInbox($inboxId, 'Release'), ActorIdentity::of($this->owner), IntervalRole::Owner);
    }

    public function test_the_owner_adds_members_once_and_hands_the_chat_over(): void
    {
        $this->asOwner();
        $this->runOnBus(new AddChatParticipant($this->chat->inbox_id, $this->keyOf($this->bea)));
        $this->runOnBus(new AddChatParticipant($this->chat->inbox_id, $this->keyOf($this->bea)));
        $this->runOnBus(new AddChatParticipant($this->chat->inbox_id, $this->keyOf($this->cy)));

        $this->assertSame(3, TimelineEvent::query()->ofInbox($this->chat->inbox_id)
            ->where('type', TimelineEventType::Joined)->count());

        $this->startUserRequestAs($this->bea->id);
        $this->assertThrows(
            fn () => $this->runOnBus(new RemoveChatParticipant($this->chat->inbox_id, $this->keyOf($this->cy))),
            ChatMembershipRefused::class,
        );

        $this->asOwner();
        $this->runOnBus(new TransferChatOwnership($this->chat->inbox_id, $this->keyOf($this->bea)));

        $this->assertTrue($this->chat->refresh()->isOwnedBy(ActorIdentity::of($this->bea)));
    }

    public function test_a_removed_member_can_no_longer_post(): void
    {
        $this->asOwner();
        $this->runOnBus(new AddChatParticipant($this->chat->inbox_id, $this->keyOf($this->cy)));
        $this->runOnBus(new RemoveChatParticipant($this->chat->inbox_id, $this->keyOf($this->cy)));

        $this->startUserRequestAs($this->cy->id);
        $this->expectException(InboxUnavailable::class);
        $this->runOnBus(new PostChatMessage($this->chat->inbox_id, 'Still here?', 'cy-post'));
    }

    public function test_an_agent_chat_takes_nobody_else(): void
    {
        $pair = $this->pairChat(ActorIdentity::of($this->owner), $this->actorOf($this->builder));
        $this->asOwner();

        $this->expectException(ChatMembershipRefused::class);
        $this->runOnBus(new AddChatParticipant($pair->inbox_id, $this->keyOf($this->bea)));
    }

    private function grantedUser(string $name): User
    {
        $user = User::factory()->create(['name' => $name]);
        EnvironmentUserGrant::grant(
            $user,
            null,
            [ChatPermission::ReceiveInvitations],
            ActorIdentity::of($this->owner),
            CarbonImmutable::now(),
        );
        $this->inboxOf(ActorIdentity::of($user));

        return $user;
    }

    private function keyOf(User $user): string
    {
        return "user:{$user->id}";
    }
}
