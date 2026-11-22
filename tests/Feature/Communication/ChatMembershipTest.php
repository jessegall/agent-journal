<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Commands\PostChatMessage\PostChatMessageCommand;
use App\Enums\ChatPermission;
use App\Enums\IntervalRole;
use App\Enums\TimelineEventType;
use App\Exceptions\InboxUnavailable;
use App\Models\TimelineEvent;
use App\Support\ActorIdentity;
use App\Support\AgentChatAccess;
use App\Support\ChatInboxes;
use App\Support\InboxIntervals;
use Carbon\CarbonImmutable;
use Domain\Access\Models\EnvironmentUserGrant;
use Domain\Access\Models\User;
use Domain\Chat\Commands\AddChatParticipant\AddChatParticipantCommand;
use Domain\Chat\Commands\RemoveChatParticipant\RemoveChatParticipantCommand;
use Domain\Chat\Commands\TransferChatOwnership\TransferChatOwnershipCommand;
use Domain\Chat\Exceptions\ChatMembershipRefused;
use Domain\Chat\Models\Conversation;
use Domain\Chat\Support\ChatInbox;
use Illuminate\Support\Str;
use Tests\Support\MessagingTestCase;
use Tests\Support\OpensPairChats;

/**
 * Ada runs her user chat: she adds Bea and Cy, adding Bea twice makes one join, Bea cannot add anyone, the owner role
 * passes to Bea in one commit, a removed member can no longer post, and both agents join beside Bea.
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
        $this->chat = Conversation::create($inboxId, $providerId, ActorIdentity::of($this->owner), null, 'Release');
        $this->app->make(InboxIntervals::class)
            ->enter(new ChatInbox($inboxId, 'Release'), ActorIdentity::of($this->owner), IntervalRole::Owner);
    }

    public function test_the_owner_adds_members_once_and_hands_the_chat_over(): void
    {
        $this->asOwner();
        $this->runOnBus(new AddChatParticipantCommand($this->chat->inbox_id, $this->keyOf($this->bea)));
        $this->runOnBus(new AddChatParticipantCommand($this->chat->inbox_id, $this->keyOf($this->bea)));
        $this->runOnBus(new AddChatParticipantCommand($this->chat->inbox_id, $this->keyOf($this->cy)));

        $this->assertSame(3, TimelineEvent::query()->ofInbox($this->chat->inbox_id)
            ->where('type', TimelineEventType::Joined)->count());

        $this->startUserRequestAs($this->bea->id);
        $this->assertThrows(
            fn () => $this->runOnBus(new RemoveChatParticipantCommand($this->chat->inbox_id, $this->keyOf($this->cy))),
            ChatMembershipRefused::class,
        );

        $this->asOwner();
        $this->runOnBus(new TransferChatOwnershipCommand($this->chat->inbox_id, $this->keyOf($this->bea)));

        $this->assertTrue($this->chat->refresh()->isOwnedBy(ActorIdentity::of($this->bea)));
    }

    public function test_a_removed_member_can_no_longer_post(): void
    {
        $this->asOwner();
        $this->runOnBus(new AddChatParticipantCommand($this->chat->inbox_id, $this->keyOf($this->cy)));
        $this->runOnBus(new RemoveChatParticipantCommand($this->chat->inbox_id, $this->keyOf($this->cy)));

        $this->startUserRequestAs($this->cy->id);
        $this->expectException(InboxUnavailable::class);
        $this->runOnBus(new PostChatMessageCommand($this->chat->inbox_id, 'Still here?', 'cy-post'));
    }

    public function test_the_owner_adds_both_agents_beside_a_user_and_an_agent_keeps_its_other_chat(): void
    {
        $access = $this->app->make(AgentChatAccess::class);

        foreach ([$this->builder, $this->reviewer] as $agent) {
            $access->allow($agent->agent_id, null, [$this->owner->id], ActorIdentity::system(), CarbonImmutable::now());
        }

        $desk = $this->pairChat(ActorIdentity::of($this->owner), $this->actorOf($this->builder));

        $this->asOwner();
        $this->runOnBus(new AddChatParticipantCommand($this->chat->inbox_id, $this->keyOf($this->bea)));
        $this->runOnBus(new AddChatParticipantCommand($this->chat->inbox_id, "agent:{$this->builder->agent_id}"));
        $this->runOnBus(new AddChatParticipantCommand($this->chat->inbox_id, "agent:{$this->reviewer->agent_id}"));

        $chats = $this->app->make(ChatInboxes::class);
        $release = new ChatInbox($this->chat->inbox_id, 'Release');
        $members = [
            ActorIdentity::of($this->owner),
            ActorIdentity::of($this->bea),
            $this->actorOf($this->builder),
            $this->actorOf($this->reviewer),
        ];

        foreach ($members as $member) {
            $this->assertTrue($chats->isActiveMember($release, $member));
        }

        $this->assertTrue($chats->isActiveMember(new ChatInbox($desk->inbox_id, 'Desk'), $this->actorOf($this->builder)));
    }

    private function grantedUser(string $name): User
    {
        $user = User::factory()->create(['name' => $name]);
        EnvironmentUserGrant::create(
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
