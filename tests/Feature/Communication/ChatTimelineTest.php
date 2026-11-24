<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Commands\Messages\PostChatMessage\PostChatMessageCommand;
use App\Contracts\Chat\ChatLines;
use App\Contracts\Chat\ChatTimeline;
use App\Enums\InboxPermission;
use App\Exceptions\ChatCursorRefused;
use App\Http\Responses\PageReadProps;
use App\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Domain\Access\Models\EnvironmentUserGrant;
use Domain\Access\Models\User;
use Domain\Chat\Commands\AddChatParticipant\AddChatParticipantCommand;
use Domain\Chat\Commands\CreateGroupChat\CreateGroupChatCommand;
use Domain\Chat\Commands\RemoveChatParticipant\RemoveChatParticipantCommand;
use Illuminate\Testing\TestResponse;
use Symfony\Component\HttpFoundation\Response;
use Tests\Support\MessagingTestCase;

/**
 * A member reads its chat from a snapshot, then only the events after its cursor; a cursor from before a rejoin is
 * refused, and a removed member is told its access ended.
 */
final class ChatTimelineTest extends MessagingTestCase
{
    private User $bea;

    private string $inboxId;

    private const string STEP_LINE = 'Step-one-of-four';

    protected function setUp(): void
    {
        parent::setUp();

        $this->bea = User::factory()->create(['name' => 'Bea']);
        EnvironmentUserGrant::create(
            $this->bea,
            null,
            [InboxPermission::ReceiveInvitations],
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
        $this->assertTrue($this->timeline()->after($this->inboxId, $old)->hasAccessEnded);

        $this->asOwner();
        $this->runOnBus(new AddChatParticipantCommand($this->inboxId, "user:{$this->bea->id}"));

        $this->startUserRequestAs($this->bea->id);
        $this->expectException(ChatCursorRefused::class);
        $this->timeline()->after($this->inboxId, $old);
    }

    public function test_the_page_reads_its_events_and_rows_by_a_partial_reload_and_a_refused_cursor_answers_409(): void
    {
        $this->runOnBus(new PostChatMessageCommand($this->inboxId, 'One.', 'one'));

        $events = $this->actingAs($this->owner)->pageRead('chat.events', ['inboxId' => $this->inboxId])->assertOk();
        $rows = $this->actingAs($this->owner)->pageRead('chat.rows', ['inboxId' => $this->inboxId])->assertOk();

        $this->assertIsString($events->json('props.read_chat_events.cursor'));
        $this->assertSame(['One.'], array_column($rows->json('props.read_chat_rows.messages'), 'body'));
        $this->assertNull($events->json('props.read_chat_rows'));

        $this->startUserRequestAs($this->bea->id);
        $old = (string) $this->timeline()->snapshot($this->inboxId)->cursor;
        $this->asOwner();
        $this->runOnBus(new RemoveChatParticipantCommand($this->inboxId, "user:{$this->bea->id}"));
        $this->runOnBus(new AddChatParticipantCommand($this->inboxId, "user:{$this->bea->id}"));

        $this->actingAs($this->bea)->pageRead('chat.events', ['inboxId' => $this->inboxId, 'cursor' => $old])
            ->assertStatus(409);
    }

    public function test_a_plain_line_posted_for_a_member_shows_in_the_chat_rows_between_the_messages(): void
    {
        $this->runOnBus(new PostChatMessageCommand($this->inboxId, 'Before.', 'before'));
        $this->app->make(ChatLines::class)->post(ActorIdentity::of($this->bea), 'Ship', self::STEP_LINE);
        $this->runOnBus(new PostChatMessageCommand($this->inboxId, 'After.', 'after'));

        $rows = $this->actingAs($this->owner)->pageRead('chat.rows', ['inboxId' => $this->inboxId])->assertOk();
        $messages = $rows->json('props.read_chat_rows.messages');
        $lines = $rows->json('props.read_chat_rows.lines');

        $this->assertSame([self::STEP_LINE], array_column($lines, 'line'));
        $this->assertGreaterThan($messages[0]['sequence'], $lines[0]['sequence']);
        $this->assertLessThan($messages[1]['sequence'], $lines[0]['sequence']);
    }

    /**
     * A page read as the chat asks for it: a partial reload of the chat page that names only that read's prop, with
     * its query under read[<prop>].
     *
     * @param  array<string, string>  $query
     * @return TestResponse<Response>
     */
    private function pageRead(string $routeName, array $query): TestResponse
    {
        $prop = PageReadProps::propName($routeName);
        $page = $this->get('/chat')->viewData('page');

        return $this->get('/chat?'.http_build_query([PageReadProps::QUERY => [$prop => $query]]), [
            'X-Inertia' => 'true',
            'X-Inertia-Version' => $page['version'],
            'X-Inertia-Partial-Component' => $page['component'],
            'X-Inertia-Partial-Data' => $prop,
        ]);
    }

    private function timeline(): ChatTimeline
    {
        return $this->app->make(ChatTimeline::class);
    }
}
