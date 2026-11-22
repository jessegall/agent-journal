<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Commands\PostChatMessage\PostChatMessageCommand;
use App\Contracts\ChatTimeline;
use App\Enums\ChatPermission;
use App\Exceptions\ChatCursorRefused;
use App\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Domain\Access\Models\EnvironmentUserGrant;
use Domain\Access\Models\User;
use Domain\Chat\Commands\AddChatParticipant\AddChatParticipantCommand;
use Domain\Chat\Commands\CreateGroupChat\CreateGroupChatCommand;
use Domain\Chat\Commands\RemoveChatParticipant\RemoveChatParticipantCommand;
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
        EnvironmentUserGrant::create(
            $this->bea,
            null,
            [ChatPermission::ReceiveInvitations],
            ActorIdentity::of($this->owner),
            CarbonImmutable::now(),
        );
        $this->inboxOf(ActorIdentity::of($this->bea));
        $this->asOwner();
        $this->inboxId = $this->runOnBus(new CreateGroupChatCommand('Design', [$this->bea->id]));
    }

    public function test_the_events_after_the_cursor_are_the_new_ones(): void
    {
        $cursor = $this->timeline()->snapshot($this->inboxId)->cursor;
        $this->runOnBus(new PostChatMessageCommand($this->inboxId, 'One.', 'one'));
        $this->runOnBus(new PostChatMessageCommand($this->inboxId, 'Two.', 'two'));

        $page = $this->timeline()->after($this->inboxId, (string) $cursor);

        $this->assertCount(2, $page->events);
        $this->assertSame([$page->watermark - 1, $page->watermark], array_column($page->events, 'sequence'));
    }

    public function test_a_cursor_from_before_a_rejoin_is_refused_and_a_removed_member_reads_access_ended(): void
    {
        $this->startUserRequestAs($this->bea->id);
        $old = (string) $this->timeline()->snapshot($this->inboxId)->cursor;

        $this->asOwner();
        $this->runOnBus(new RemoveChatParticipantCommand($this->inboxId, "user:{$this->bea->id}"));

        $this->startUserRequestAs($this->bea->id);
        $this->assertTrue($this->timeline()->after($this->inboxId, $old)->accessEnded);

        $this->asOwner();
        $this->runOnBus(new AddChatParticipantCommand($this->inboxId, "user:{$this->bea->id}"));

        $this->startUserRequestAs($this->bea->id);
        $this->expectException(ChatCursorRefused::class);
        $this->timeline()->after($this->inboxId, $old);
    }

    private function timeline(): ChatTimeline
    {
        return $this->app->make(ChatTimeline::class);
    }
}
