<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Actors\Enums\ChatPermission;
use App\Actors\Support\ActorIdentity;
use App\Communication\Commands\PostChatMessage;
use App\Communication\Exceptions\InboxUnavailable;
use App\Communication\Support\ChatInboxes;
use Carbon\CarbonImmutable;
use Domain\Access\Models\EnvironmentUserGrant;
use Domain\Access\Models\User;
use Domain\Access\Support\EnvironmentAccess;
use Domain\Chat\Commands\CreateGroupChat;
use Domain\Chat\Models\Conversation;
use Domain\Chat\Support\ChatInbox;
use Tests\Support\MessagingTestCase;

/**
 * Losing a grant or an account ends a user's chats in the same transaction: a member is simply gone, an owner hands
 * its chat to the earliest-joined member who may manage it, and a chat nobody may manage closes.
 */
final class ChatRevocationTest extends MessagingTestCase
{
    public function test_revoking_the_owner_hands_the_chat_to_a_manager_and_the_revoked_user_can_no_longer_post(): void
    {
        $bea = $this->grantedUser('Bea', [ChatPermission::CreateChats, ChatPermission::ManageMembers]);
        $cy = $this->grantedUser('Cy', [ChatPermission::ReceiveInvitations, ChatPermission::ManageMembers]);

        $this->startUserRequestAs($bea->id);
        $inboxId = $this->runOnBus(new CreateGroupChat('Design', [$cy->id]));

        $this->app->make(EnvironmentAccess::class)->revoke($bea, null, CarbonImmutable::now());

        $chat = Conversation::forInbox($inboxId);
        $members = $this->app->make(ChatInboxes::class)->activeIntervals(new ChatInbox($inboxId, 'Design'));

        $this->assertTrue($chat->isOwnedBy(ActorIdentity::of($cy)));
        $this->assertSame([ActorIdentity::of($cy)->id], array_map(fn ($member) => $member->actor->id, $members));

        $this->startUserRequestAs($bea->id);
        $this->expectException(InboxUnavailable::class);
        $this->runOnBus(new PostChatMessage($inboxId, 'Still here?', 'bea-late'));
    }

    public function test_disabling_the_owner_of_a_chat_nobody_else_may_manage_closes_it(): void
    {
        $bea = $this->grantedUser('Bea', [ChatPermission::CreateChats, ChatPermission::ManageMembers]);
        $dee = $this->grantedUser('Dee', [ChatPermission::ReceiveInvitations]);

        $this->startUserRequestAs($bea->id);
        $inboxId = $this->runOnBus(new CreateGroupChat('Quiet', [$dee->id]));

        $this->app->make(EnvironmentAccess::class)->disable($bea, CarbonImmutable::now());

        $this->assertFalse(Conversation::forInbox($inboxId)->isOpen());
    }

    /**
     * @param  list<ChatPermission>  $permissions
     */
    private function grantedUser(string $name, array $permissions): User
    {
        $user = User::factory()->create(['name' => $name]);
        EnvironmentUserGrant::grant($user, null, $permissions, ActorIdentity::of($this->owner), CarbonImmutable::now());
        $this->inboxOf(ActorIdentity::of($user));

        return $user;
    }
}
