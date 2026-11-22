<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Commands\ReadMessages\ReadMessagesCommand;
use App\Contracts\Chat\ConversationResolver;
use App\Contracts\Chat\InboxRegistration;
use App\Exceptions\StackLockTimedOut;
use App\Models\InboxRecord;
use App\Models\Message;
use App\Models\MessageAttention;
use App\Support\OperationDeadline;
use Tests\Fixtures\Communication\TeamInboxAccess;
use Tests\Fixtures\Communication\TeamInboxProvider;
use Tests\Fixtures\Communication\TeamRoster;
use Tests\Support\MessagingTestCase;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\UsesSecondConnection;

/**
 * A second inbox provider, a team with its own roster and guard, goes through the same Core paths as a desk: its
 * members see, read and are asked to attend to its messages, and a membership change holds its guard against sends.
 */
#[TimeLimit(seconds: 5, reason: 'One case waits for a database lock held on a second connection to time out.')]
final class InboxProviderContractTest extends MessagingTestCase
{
    use UsesSecondConnection;

    private InboxRecord $team;

    protected function setUp(): void
    {
        parent::setUp();

        $roster = new TeamRoster();
        $this->app->instance(TeamRoster::class, $roster);
        $this->app->make(InboxRegistration::class)->register('team', TeamInboxProvider::class, TeamInboxAccess::class);
        $this->team = InboxRecord::create('team', 'alpha');
        $roster->join($this->team->id, $this->actorOf($this->builder));
    }

    public function test_a_team_message_is_seen_read_and_attended_by_its_members_only(): void
    {
        $messageId = $this->ownerSends($this->team->id, 'For the team.');

        $this->asAgent($this->builder);
        $history = $this->resolver()->history($this->team->id, null, 50);
        $this->assertSame([$messageId], array_column($history->messages, 'id'));
        $read = $this->runOnBus(new ReadMessagesCommand($this->team->id, [$messageId]));
        $this->assertTrue($read->messageReads[0]->firstRead);

        $this->asAgent($this->reviewer);
        $this->assertSame([], $this->resolver()->history($this->team->id, null, 50)->messages);
        $this->assertSame(
            [$this->builder->agent_id],
            MessageAttention::query()->pluck('actor_id')->all(),
        );
    }

    public function test_a_membership_change_holds_the_team_guard_against_a_send(): void
    {
        $this->app->instance(OperationDeadline::class, new OperationDeadline(500));
        $other = $this->otherConnection();
        $other->beginTransaction();
        $other->table('inboxes')->where('id', $this->team->id)->lockForUpdate()->first();

        try {
            $this->assertThrows(
                fn () => $this->ownerSends($this->team->id, 'During the change?'),
                StackLockTimedOut::class,
            );
        } finally {
            $other->rollBack();
        }

        $this->assertSame(0, Message::query()->withoutGlobalScopes()->count());
    }

    private function resolver(): ConversationResolver
    {
        return $this->app->make(ConversationResolver::class);
    }
}
