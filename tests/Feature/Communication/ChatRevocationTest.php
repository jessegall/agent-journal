<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Commands\PostChatMessage\PostChatMessageCommand;
use App\Contracts\Chat\ChatParticipationEnding;
use App\Contracts\Chat\InboxResolver;
use App\Enums\ChatPermission;
use App\Events\EngineTicked;
use App\Exceptions\InboxUnavailable;
use App\Support\ActorIdentity;
use App\Support\ChatInboxes;
use App\Support\EngineListenerSet;
use App\Support\EngineTickedDelivery;
use App\Support\Ticks\ElapsedTime;
use Carbon\CarbonImmutable;
use Domain\Access\Commands\DisableUser\DisableUserCommand;
use Domain\Access\Commands\RevokeEnvironmentAccess\RevokeEnvironmentAccessCommand;
use Domain\Access\Models\EnvironmentUserGrant;
use Domain\Access\Models\User;
use Domain\Chat\Commands\CreateGroupChat\CreateGroupChatCommand;
use Domain\Chat\Models\Conversation;
use Domain\Chat\Support\ChatInbox;
use Domain\Chat\Support\ChatRevocation;
use Domain\Chat\Support\SettleMarkedChatsOnTick;
use Tests\Support\Engine\RunsEnginePasses;
use Tests\Support\MessagingTestCase;

/**
 * Losing a grant or an account ends a user's chats in the same transaction: a member is simply gone, an owner hands
 * its chat to the earliest-joined member who may manage it, and a chat nobody may manage closes.
 */
final class ChatRevocationTest extends MessagingTestCase
{
    use RunsEnginePasses;

    public function test_revoking_the_owner_hands_the_chat_to_a_manager_and_the_revoked_user_can_no_longer_post(): void
    {
        $bea = $this->grantedUser('Bea', [ChatPermission::CreateChats, ChatPermission::ManageMembers]);
        $cy = $this->grantedUser('Cy', [ChatPermission::ReceiveInvitations, ChatPermission::ManageMembers]);

        $this->startUserRequestAs($bea->id);
        $inboxId = $this->runOnBus(new CreateGroupChatCommand('Design', [$cy->id]));

        $this->startUserRequestAs($this->owner->id);
        $this->runOnBus(new RevokeEnvironmentAccessCommand($bea->id, null));

        $chat = Conversation::forInbox($inboxId);
        $members = $this->app->make(ChatInboxes::class)->activeIntervals(new ChatInbox($inboxId, 'Design'));

        $this->assertTrue($chat->isOwnedBy(ActorIdentity::of($cy)));
        $this->assertSame([ActorIdentity::of($cy)->id], array_map(fn ($member) => $member->actor->id, $members));

        $this->startUserRequestAs($bea->id);
        $this->expectException(InboxUnavailable::class);
        $this->runOnBus(new PostChatMessageCommand($inboxId, 'Still here?', 'bea-late'));
    }

    public function test_disabling_the_owner_of_a_chat_nobody_else_may_manage_closes_it(): void
    {
        $bea = $this->grantedUser('Bea', [ChatPermission::CreateChats, ChatPermission::ManageMembers]);
        $dee = $this->grantedUser('Dee', [ChatPermission::ReceiveInvitations]);

        $this->startUserRequestAs($bea->id);
        $inboxId = $this->runOnBus(new CreateGroupChatCommand('Quiet', [$dee->id]));

        $this->startUserRequestAs($this->owner->id);
        $this->runOnBus(new DisableUserCommand($bea->id));

        $this->assertFalse(Conversation::forInbox($inboxId)->isOpen());
    }

    public function test_a_revocation_past_the_inline_limit_marks_the_remaining_chats_and_refuses_the_user_there(): void
    {
        $this->app->bind(
            ChatParticipationEnding::class,
            fn () => $this->app->make(ChatRevocation::class, ['inlineChatLimit' => 2]),
        );
        $cy = $this->grantedUser('Cy', [ChatPermission::ReceiveInvitations]);
        $this->startUserRequestAs($this->owner->id);
        $inboxIds = [];

        foreach (['Design', 'Build', 'Ship'] as $title) {
            $inboxIds[] = $this->runOnBus(new CreateGroupChatCommand($title, [$cy->id]));
        }

        sort($inboxIds);
        $this->runOnBus(new RevokeEnvironmentAccessCommand($cy->id, null));

        $members = fn (string $inboxId) => array_map(
            fn ($member) => $member->actor->id,
            $this->app->make(ChatInboxes::class)->activeIntervals(new ChatInbox($inboxId, 'Chat')),
        );
        $this->assertSame(
            [false, false, true],
            array_map(fn (string $inboxId) => in_array($cy->id, $members($inboxId), true), $inboxIds),
        );
        $this->assertSame(
            [false, false, true],
            array_map(fn (string $inboxId) => Conversation::forInbox($inboxId)->isReconcilePending(), $inboxIds),
        );

        $inboxes = $this->app->make(InboxResolver::class);
        $marked = $inboxes->resolve($inboxIds[2]);
        $this->expectException(InboxUnavailable::class);
        $inboxes->accessFor($marked)->membership($marked, $cy);
    }

    public function test_a_post_into_a_marked_chat_settles_it_first_and_leaves_an_untouched_one_marked(): void
    {
        $this->app->bind(
            ChatParticipationEnding::class,
            fn () => $this->app->make(ChatRevocation::class, ['inlineChatLimit' => 0]),
        );
        $cy = $this->grantedUser('Cy', [ChatPermission::ReceiveInvitations]);
        $this->startUserRequestAs($this->owner->id);
        $posted = $this->runOnBus(new CreateGroupChatCommand('Design', [$cy->id]));
        $swept = $this->runOnBus(new CreateGroupChatCommand('Build', [$cy->id]));
        $this->runOnBus(new RevokeEnvironmentAccessCommand($cy->id, null));
        $isMember = fn (string $inboxId) => in_array($cy->id, array_map(
            fn ($member) => $member->actor->id,
            $this->app->make(ChatInboxes::class)->activeIntervals(new ChatInbox($inboxId, 'Chat')),
        ), true);

        $this->assertSame([true, true], [$isMember($posted), $isMember($swept)]);

        $this->runOnBus(new PostChatMessageCommand($posted, 'Plan?', 'plan-1'));

        $this->assertSame([false, true], [$isMember($posted), $isMember($swept)]);
        $this->assertSame(
            [false, true],
            [Conversation::forInbox($posted)->isReconcilePending(), Conversation::forInbox($swept)->isReconcilePending()],
        );
    }

    public function test_a_marked_chat_nobody_opens_is_settled_by_one_engine_pass(): void
    {
        $this->app->bind(
            ChatParticipationEnding::class,
            fn () => $this->app->make(ChatRevocation::class, ['inlineChatLimit' => 0]),
        );
        $cy = $this->grantedUser('Cy', [ChatPermission::ReceiveInvitations]);
        $this->startUserRequestAs($this->owner->id);
        $marked = $this->runOnBus(new CreateGroupChatCommand('Design', [$cy->id]));
        $this->runOnBus(new RevokeEnvironmentAccessCommand($cy->id, null));

        $this->assertTrue($this->app->make(EngineListenerSet::class)->has(SettleMarkedChatsOnTick::class));
        $this->assertTrue(Conversation::forInbox($marked)->isReconcilePending());

        $this->pass(fn () => $this->app->make(EngineTickedDelivery::class)->deliver(
            new EngineTicked(CarbonImmutable::now(), ElapsedTime::between(0, 1_000_000_000)),
        ));

        $members = array_map(
            fn ($member) => $member->actor->id,
            $this->app->make(ChatInboxes::class)->activeIntervals(new ChatInbox($marked, 'Chat')),
        );
        $this->assertSame(
            [false, false],
            [Conversation::forInbox($marked)->isReconcilePending(), in_array($cy->id, $members, true)],
        );
    }

    public function test_a_marked_chat_is_found_until_it_is_cleared_and_a_closed_chat_never_is(): void
    {
        $dee = $this->grantedUser('Dee', [ChatPermission::ReceiveInvitations]);
        $this->startUserRequestAs($this->owner->id);
        $open = Conversation::forInbox($this->runOnBus(new CreateGroupChatCommand('Open', [$dee->id])));
        $closed = Conversation::forInbox($this->runOnBus(new CreateGroupChatCommand('Closed', [$dee->id])));

        $open->markReconcilePending();
        $closed->markReconcilePending();
        $closed->close(CarbonImmutable::now());
        $found = Conversation::query()->awaitingReconcile()->readUpTo(10)->pluck('id')->all();

        $this->assertSame([$open->id], $found);
        $open->clearReconcilePending();
        $this->assertFalse($open->refresh()->isReconcilePending());
        $this->assertSame([], Conversation::query()->awaitingReconcile()->readUpTo(10)->pluck('id')->all());
    }

    /**
     * @param  list<ChatPermission>  $permissions
     */
    private function grantedUser(string $name, array $permissions): User
    {
        $user = User::factory()->create(['name' => $name]);
        EnvironmentUserGrant::create($user, null, $permissions, ActorIdentity::of($this->owner), CarbonImmutable::now());
        $this->inboxOf(ActorIdentity::of($user));

        return $user;
    }
}
