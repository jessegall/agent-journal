<?php

declare(strict_types=1);

namespace Tests\Machinery\Web;

use App\Events\Hooks\RunningToolChanged;
use App\Events\Web\RunningCommandChanged;
use App\Listeners\BroadcastRunningCommand;
use App\Models\Inboxes\InboxMember;
use App\Web\UserChannel;
use Carbon\CarbonImmutable;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Support\Facades\Event;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\TestCase;

/**
 * Each change of an agent's chat line reaches the users who share a chat with the agent, once each however many
 * chats they share, with only the line, the running flag and the time; nobody else hears it.
 */
#[TestsMachinery(BroadcastRunningCommand::class)]
final class BroadcastRunningCommandTest extends TestCase
{
    private const string CHANGED_AT = '2026-11-28T10:00:00.123456Z';

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->user('Alex')->user('Stranger')->idleAgent('Planner')
            ->sharedInbox('Owner', 'Planner')
            ->sharedInbox('Alex', 'Planner');
        // The owner shares a second chat with Planner, so one message per user is what is asked.
        InboxMember::create(
            $this->journal->sharedInboxOf('Alex', 'Planner')->id,
            $this->journal->actorCalled('Owner'),
            CarbonImmutable::now(),
        );
        Event::fake([RunningCommandChanged::class]);
    }

    public function test_the_members_of_the_agents_chats_receive_one_message_each_with_the_line(): void
    {
        $this->changePlanner();

        Event::assertDispatchedTimes(RunningCommandChanged::class, 1);
        Event::assertDispatched(RunningCommandChanged::class, function (RunningCommandChanged $message) {
            $userIds = $message->userIds;
            sort($userIds);
            $expected = [$this->journal->userCalled('Owner')->id, $this->journal->userCalled('Alex')->id];
            sort($expected);

            $this->assertSame($expected, $userIds);
            $this->assertSame([
                'agentId' => $this->journal->agentCalled('Planner')->id,
                'line' => 'Bash npm test',
                'isRunning' => true,
                'changedAt' => self::CHANGED_AT,
            ], $message->broadcastWith());
            $this->assertSame(RunningCommandChanged::NAME, $message->broadcastAs());
            $this->assertSame(
                array_map(fn (string $userId) => 'private-'.UserChannel::nameFor($userId), $message->userIds),
                array_map(fn (PrivateChannel $channel) => $channel->name, $message->broadcastOn()),
            );

            return true;
        });
    }

    public function test_a_removed_member_receives_no_further_lines(): void
    {
        $alex = $this->journal->actorCalled('Alex');
        InboxMember::query()
            ->active()
            ->ofInbox($this->journal->sharedInboxOf('Alex', 'Planner')->id)
            ->ofActor($alex)
            ->sole()
            ->leave(CarbonImmutable::now());

        $this->changePlanner();

        Event::assertDispatched(
            RunningCommandChanged::class,
            fn (RunningCommandChanged $message) => ! in_array($alex->id, $message->userIds, true),
        );
    }

    public function test_an_agent_in_no_chat_with_a_user_sends_nothing(): void
    {
        $this->journal->idleAgent('Coder');

        $this->app->make(BroadcastRunningCommand::class)->handle(
            new RunningToolChanged($this->journal->agentCalled('Coder')->id, 'Bash ls', true, self::CHANGED_AT),
        );

        Event::assertNotDispatched(RunningCommandChanged::class);
    }

    private function changePlanner(): void
    {
        $this->app->make(BroadcastRunningCommand::class)->handle(
            new RunningToolChanged($this->journal->agentCalled('Planner')->id, 'Bash npm test', true, self::CHANGED_AT),
        );
    }
}
