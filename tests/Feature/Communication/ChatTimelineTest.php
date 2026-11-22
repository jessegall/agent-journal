<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Actors\Enums\ChatPermission;
use App\Actors\Support\ActorIdentity;
use App\Communication\Commands\PostChatMessage;
use App\Communication\Exceptions\ChatCursorRefused;
use App\Communication\Resolvers\ChatTimeline;
use Carbon\CarbonImmutable;
use Domain\Access\Models\EnvironmentUserGrant;
use Domain\Access\Models\User;
use Domain\Chat\Commands\AddChatParticipant;
use Domain\Chat\Commands\CreateGroupChat;
use Domain\Chat\Commands\RemoveChatParticipant;
use Tests\Support\MessagingTestCase;

/**
 * A member reads its chat from a snapshot, then only the events after its cursor; a cursor from before a rejoin is
 * refused, and a removed member is told its access ended.
 */
final class ChatTimelineTest extends MessagingTestCase
{
    private User $bea;

    private string $inboxId;

    protected function setUp(): void
    {
        parent::setUp();

        $this->bea = User::factory()->create(['name' => 'Bea']);
        EnvironmentUserGrant::grant(
            $this->bea,
            null,
            [ChatPermission::ReceiveInvitations],
            ActorIdentity::of($this->owner),
            CarbonImmutable::now(),
        );
        $this->inboxOf(ActorIdentity::of($this->bea));
        $this->asOwner();
        $this->inboxId = $this->runOnBus(new CreateGroupChat('Design', [$this->bea->id]));
    }

    public function test_the_events_after_the_cursor_are_the_new_ones(): void
    {
        $cursor = $this->timeline()->snapshot($this->inboxId)->cursor;
        $this->runOnBus(new PostChatMessage($this->inboxId, 'One.', 'one'));
        $this->runOnBus(new PostChatMessage($this->inboxId, 'Two.', 'two'));

        $page = $this->timeline()->after($this->inboxId, (string) $cursor);

        $this->assertCount(2, $page->events);
        $this->assertSame([$page->watermark - 1, $page->watermark], array_column($page->events, 'sequence'));
    }

    public function test_a_cursor_from_before_a_rejoin_is_refused_and_a_removed_member_reads_access_ended(): void
    {
        $this->startUserRequestAs($this->bea->id);
        $old = (string) $this->timeline()->snapshot($this->inboxId)->cursor;

        $this->asOwner();
        $this->runOnBus(new RemoveChatParticipant($this->inboxId, "user:{$this->bea->id}"));

        $this->startUserRequestAs($this->bea->id);
        $this->assertTrue($this->timeline()->after($this->inboxId, $old)->accessEnded);

        $this->asOwner();
        $this->runOnBus(new AddChatParticipant($this->inboxId, "user:{$this->bea->id}"));

        $this->startUserRequestAs($this->bea->id);
        $this->expectException(ChatCursorRefused::class);
        $this->timeline()->after($this->inboxId, $old);
    }

    private function timeline(): ChatTimeline
    {
        $this->app->forgetScopedInstances();

        return $this->app->make(ChatTimeline::class);
    }
}
