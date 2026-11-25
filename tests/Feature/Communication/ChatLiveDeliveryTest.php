<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Enums\LeaveReason;
use App\Enums\Messages\InboxPermission;
use App\Events\Messages\ChatMemberLeft;
use App\Events\Messages\ChatMessageAccepted;
use App\Events\Web\InboxAccessEnded;
use App\Events\Web\PageChanged;
use App\Listeners\BroadcastPageChange;
use App\Models\Access\EnvironmentUserGrant;
use App\Models\Access\User;
use App\Support\ActorIdentity;
use App\Support\UserChannel;
use Carbon\CarbonImmutable;
use Domain\Chat\Commands\CreateGroupChat\CreateGroupChatCommand;
use Domain\Chat\Commands\RemoveChatParticipant\RemoveChatParticipantCommand;
use Illuminate\Support\Facades\Event;
use Tests\Support\MessagingTestCase;

/**
 * A chat fact reaches each active member's channel, a member who leaves gets one access-ended notice, and nothing
 * about the chat reaches it after that.
 */
final class ChatLiveDeliveryTest extends MessagingTestCase
{
    public function test_a_post_reaches_the_members_and_a_removed_member_hears_nothing_more(): void
    {
        $bea = User::factory()->create(['name' => 'Bea']);
        EnvironmentUserGrant::create(
            $bea,
            null,
            [InboxPermission::ReceiveInvitations],
            ActorIdentity::of($this->owner),
            CarbonImmutable::now(),
        );
        $this->inboxOf(ActorIdentity::of($bea));
        $this->asOwner();
        $inboxId = $this->runOnBus(new CreateGroupChatCommand('Design', [$bea->id]));
        $owner = ActorIdentity::of($this->owner);

        $this->assertTrue($this->app->make(UserChannel::class)->join($bea, $bea->id));

        Event::fake([PageChanged::class, InboxAccessEnded::class]);
        $listener = $this->app->make(BroadcastPageChange::class);
        $listener->handle(new ChatMessageAccepted('message', $owner, $inboxId));
        Event::assertDispatched(
            PageChanged::class,
            fn (PageChanged $change) => in_array($bea->id, $change->userIds, true),
        );

        $this->runOnBus(new RemoveChatParticipantCommand($inboxId, "user:{$bea->id}"));
        Event::fake([PageChanged::class, InboxAccessEnded::class]);
        $listener = $this->app->make(BroadcastPageChange::class);
        $listener->handle(new ChatMemberLeft('interval', $inboxId, ActorIdentity::of($bea), LeaveReason::Removed));
        $listener->handle(new ChatMessageAccepted('later', $owner, $inboxId));

        Event::assertDispatchedTimes(InboxAccessEnded::class, 1);
        Event::assertNotDispatched(
            PageChanged::class,
            fn (PageChanged $change) => in_array($bea->id, $change->userIds, true),
        );
    }
}
