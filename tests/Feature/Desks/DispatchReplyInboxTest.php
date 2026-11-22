<?php

declare(strict_types=1);

namespace Tests\Feature\Desks;

use App\Actors\Support\ActorIdentity;
use App\Agents\Actions\StartSessions;
use App\Agents\Commands\StartAgent\StartAgentCommand;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\StartOriginType;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Models\StartRecord;
use App\Agents\Values\StartPolicy;
use App\Agents\Values\StartRequest;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Bus\Contracts\CommandBus;
use App\Desks\Support\DeskOpening;
use App\Desks\Support\DeskSeating;
use App\Desks\Support\SeatChange;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskRun;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A run or a helper start made by the actor at main answers to main's inbox, and keeps that inbox after main's
 * occupant changes.
 */
final class DispatchReplyInboxTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;
    use WithActiveAccount;

    private const array TABLES = [
        'users',
        'tasks',
        'task_runs',
        'agents',
        'agent_sessions',
        'start_tokens',
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
        'start_records',
        'session_policies',
        'capacity_reservations',
        'accounts',
        'active_accounts',
        'process_starts',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->chooseActiveAccounts();
    }

    #[TimeLimit(seconds: 5, reason: 'It starts two agent sessions and seats a desk before it dispatches.')]
    public function test_a_run_keeps_mains_inbox_after_mains_occupant_changes(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $main = $this->app->make(DeskOpening::class)->openNamed('main', 'Main inbox', 1, true);
        $first = $this->started('First');
        $second = $this->started('Second');
        $task = Task::factory()->create();
        $this->startUserRequestAs($owner->id);
        $seat = $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(DeskSeating::class)->seat(
                $main->id,
                ActorIdentity::of($first->agent()->firstOrFail()),
            ),
        );
        $this->startRequestAs($first->agent_id, $first->id);
        $this->app->make(CommandBus::class)->run(new StartTaskCommand($task->id));
        $run = TaskRun::query()->where('task_id', $task->id)->sole();

        $this->assertSame($main->inbox_id, $run->replyInboxId()->get());

        $this->startUserRequestAs($owner->id);
        $this->app->make(AssignmentTransaction::class)->run(fn () => $this->app->make(DeskSeating::class)->replace(
            new SeatChange(
                $main->id,
                $seat->seatId,
                $seat->reference,
                ActorIdentity::of($second->agent()->firstOrFail()),
            ),
        ));

        $this->assertSame($main->inbox_id, $run->refresh()->replyInboxId()->get());
    }

    #[TimeLimit(seconds: 5, reason: 'It starts two agent sessions and seats a desk before it dispatches.')]
    public function test_a_helper_start_keeps_mains_inbox_after_mains_occupant_changes(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $main = $this->app->make(DeskOpening::class)->openNamed('main', 'Main inbox', 1, true);
        $first = $this->started('First');
        $second = $this->started('Second');
        $helper = Agent::create('Researcher', 'read-only-helper');
        $this->startUserRequestAs($owner->id);
        $seat = $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(DeskSeating::class)->seat(
                $main->id,
                ActorIdentity::of($first->agent()->firstOrFail()),
            ),
        );
        $this->startRequestAs($first->agent_id, $first->id);
        $request = new StartRequest(
            TestSelections::requestId(),
            $helper->id,
            TestSelections::of(),
            StartOriginType::OwnerRequest,
            'helpers.job 1',
            null,
            ConversationModeType::New,
            null,
            StartPolicy::withoutProfile(TestSelections::onHost()),
        );
        $this->app->make(CommandBus::class)->run(new StartAgentCommand($request));
        $record = StartRecord::query()->where('request_id', $request->requestId)->sole();

        $this->assertSame($main->inbox_id, $record->replyInboxId()->get());

        $this->startUserRequestAs($owner->id);
        $this->app->make(AssignmentTransaction::class)->run(fn () => $this->app->make(DeskSeating::class)->replace(
            new SeatChange(
                $main->id,
                $seat->seatId,
                $seat->reference,
                ActorIdentity::of($second->agent()->firstOrFail()),
            ),
        ));

        $this->assertSame($main->inbox_id, $record->refresh()->replyInboxId()->get());
    }

    private function started(string $name): AgentSession
    {
        return $this->app->make(StartSessions::class)
            ->start(Agent::create($name, 'main-agent'), TestSelections::of('claude-code'), TestSelections::requestId())
            ->session;
    }
}
