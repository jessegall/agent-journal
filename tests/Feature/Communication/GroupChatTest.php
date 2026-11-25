<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Commands\Messages\PostChatMessage\PostChatMessageCommand;
use App\Commands\Messages\ReplyInChat\ReplyInChatCommand;
use App\Enums\Messages\InboxPermission;
use App\Models\Access\EnvironmentUserGrant;
use App\Models\Access\User;
use App\Support\ActorIdentity;
use App\Support\ChatInboxes;
use Carbon\CarbonImmutable;
use Domain\Chat\Commands\CreateGroupChat\CreateGroupChatCommand;
use Domain\Chat\Data\ConversationData;
use Domain\Chat\Resolvers\Support\ChatConversations;
use Domain\Chat\Support\ChatInbox;
use Tests\Support\MessagingTestCase;

/**
 * Ada opens Design with Bea and Cy: all three are in it, any of them posts and replies with no agent in the chat, and
 * only Ada's page data offers the management actions.
 */
final class GroupChatTest extends MessagingTestCase
{
    public function test_ada_creates_design_with_bea_and_cy_and_only_she_manages_it(): void
    {
        $bea = $this->grantedUser('Bea');
        $cy = $this->grantedUser('Cy');

        $this->asOwner();
        $inboxId = $this->runOnBus(new CreateGroupChatCommand('Design', [$bea->id, $cy->id]));

        $members = $this->app->make(ChatInboxes::class)->activeIntervals(new ChatInbox($inboxId, 'Design'));
        $this->assertCount(3, $members);
        $this->assertTrue($this->pageOf($inboxId)->capabilities->canAdd);

        $this->startUserRequestAs($bea->id);
        $postId = $this->runOnBus(new PostChatMessageCommand($inboxId, 'Draft is up.', 'bea-post'));
        $this->assertFalse($this->pageOf($inboxId)->capabilities->canAdd);

        $this->startUserRequestAs($cy->id);
        $replyId = $this->runOnBus(new ReplyInChatCommand($postId, 'Looks good.', 'cy-reply'));

        $this->assertNotSame($postId, $replyId);
        $this->assertNull($this->pageOf($inboxId)->agentId);
    }

    private function pageOf(string $inboxId): ConversationData
    {
        return $this->app->make(ChatConversations::class)->pageFor(null, $inboxId, null);
    }

    private function grantedUser(string $name): User
    {
        $user = User::factory()->create(['name' => $name]);
        EnvironmentUserGrant::create(
            $user,
            null,
            [InboxPermission::ReceiveInvitations],
            ActorIdentity::of($this->owner),
            CarbonImmutable::now(),
        );
        $this->inboxOf(ActorIdentity::of($user));

        return $user;
    }
}
