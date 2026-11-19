<?php

declare(strict_types=1);

namespace Tests\Feature\Desks;

use App\Actors\Support\ActorIdentity;
use App\Agents\Actions\LaunchSessions;
use App\Agents\Commands\LaunchAgent;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\LaunchOriginType;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Models\LaunchRecord;
use App\Agents\Support\LaunchPolicy;
use App\Agents\Support\LaunchRequest;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Bus\Contracts\CommandBus;
use App\Desks\Contracts\SeatingWriter;
use App\Desks\Models\DeskRecord;
use App\Desks\Support\SeatChange;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Tasks\Commands\StartTask;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskRun;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * A run or a helper launch started by the actor at main answers to main's inbox, and keeps that inbox after main's
 * occupant changes.
 */
final class DispatchReplyInboxTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;

    private const array TABLES = [
        'users',
        'tasks',
        'task_runs',
        'agents',
        'agent_sessions',
        'launch_credentials',
        'agent_stacks',
        'hook_calls',
        'links',
        'inboxes',
        'desks',
        'desk_seats',
        'desk_preferences',
        'assignments',
        'claim_authorizations',
        'command_receipts',
        'launch_records',
        'session_policies',
        'capacity_reservations',
    ];

    public function test_a_run_keeps_mains_inbox_after_mains_occupant_changes(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $main = DeskRecord::openNamed('main', 'Main inbox', 1, true);
        $first = $this->launched('First');
        $second = $this->launched('Second');
        $task = Task::factory()->create();
        $this->startUserRequestAs($owner->id);
        $seat = $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(SeatingWriter::class)->seat($main->id, ActorIdentity::of($first->agent()->firstOrFail())),
        );
        $this->startRequestAs($first->agent_id, $first->id);
        $this->app->make(CommandBus::class)->run(new StartTask($task->id));
        $run = TaskRun::query()->where('task_id', $task->id)->sole();

        $this->assertSame($main->inbox_id, $run->replyInboxId()->get());

        $this->startUserRequestAs($owner->id);
        $this->app->make(AssignmentTransaction::class)->run(fn () => $this->app->make(SeatingWriter::class)->replace(
            new SeatChange($main->id, $seat->seatId, $seat->reference, ActorIdentity::of($second->agent()->firstOrFail())),
        ));

        $this->assertSame($main->inbox_id, $run->refresh()->replyInboxId()->get());
    }

    public function test_a_helper_launch_keeps_mains_inbox_after_mains_occupant_changes(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $main = DeskRecord::openNamed('main', 'Main inbox', 1, true);
        $first = $this->launched('First');
        $second = $this->launched('Second');
        $helper = Agent::named('Researcher', 'read-only-helper');
        $this->startUserRequestAs($owner->id);
        $seat = $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(SeatingWriter::class)->seat($main->id, ActorIdentity::of($first->agent()->firstOrFail())),
        );
        $this->startRequestAs($first->agent_id, $first->id);
        $request = new LaunchRequest(
            TestSelections::requestId(),
            $helper->id,
            TestSelections::of(),
            LaunchOriginType::OwnerRequest,
            'helpers.job 1',
            null,
            ConversationModeType::New,
            null,
            LaunchPolicy::withoutProfile(TestSelections::onHost()),
        );
        $this->app->make(CommandBus::class)->run(new LaunchAgent($request));
        $record = LaunchRecord::query()->where('request_id', $request->requestId)->sole();

        $this->assertSame($main->inbox_id, $record->replyInboxId()->get());

        $this->startUserRequestAs($owner->id);
        $this->app->make(AssignmentTransaction::class)->run(fn () => $this->app->make(SeatingWriter::class)->replace(
            new SeatChange($main->id, $seat->seatId, $seat->reference, ActorIdentity::of($second->agent()->firstOrFail())),
        ));

        $this->assertSame($main->inbox_id, $record->refresh()->replyInboxId()->get());
    }

    private function launched(string $name): AgentSession
    {
        return $this->app->make(LaunchSessions::class)
            ->launch(Agent::named($name, 'main-agent'), TestSelections::of('claude-code'), TestSelections::requestId())
            ->session;
    }
}
