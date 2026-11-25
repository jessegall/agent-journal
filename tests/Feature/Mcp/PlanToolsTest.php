<?php

declare(strict_types=1);

namespace Tests\Feature\Mcp;

use App\Contracts\Bus\CommandBus;
use App\Models\Access\User;
use App\Support\Access\AccessSettings;
use Domain\Plans\Models\Plan;
use Domain\Plans\PlansDomain;
use Domain\Tasks\Commands\FinishTask\FinishTaskCommand;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

#[TimeLimit(8, 'The plan flowsOutsideMcp cross several signed requests and inspect persisted outcomes.')]
final class PlanToolsTest extends TestCase
{
    use CommitsHookRows;

    private const string RELEASE_NOTE = 'Release complete.';

    private const string CANCEL_REASON = 'Work moved elsewhere.';

    private const string PLAN_TITLE = 'New title';

    private const array TABLES = [
        'users', 'agents', 'agent_sessions', 'agent_stacks', 'session_tokens',
        'tasks', 'plans', 'phases', 'phase_tasks', 'assignments', 'command_receipts',
    ];

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class, TasksDomain::class);
    }

    private TestStart $caller;

    private string $ownerId;

    protected function setUp(): void
    {
        parent::setUp();

        $owner = User::factory()->create();
        $this->ownerId = $owner->id;
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->caller = TestStart::start();
    }

    public function test_an_agent_builds_starts_reads_and_finishes_a_plan_across_the_two_surfaces(): void
    {
        $this->caller->openStack($this->app);
        $create = [
            'title' => 'Release', 'brief' => 'Ship the release.', 'type' => 'build', 'request_key' => 'make-plan',
        ];
        $id = $this->journal->mcpTool($this->caller, 'plans_create', $create)->assertOk()
            ->assertJsonPath('result.isError', false)->json('result.structuredContent.plan_id');
        $this->journal->agentCall(
            $this->caller,
            'POST',
            '/agent/plans/create',
            $create,
        )->assertOk()->assertJsonPath('plan_id', $id);
        $first = $this->phase($id, 'Build', 'make-build-phase');
        $second = $this->phase($id, 'Check', 'make-check-phase');
        $build = Task::factory()->create();
        $check = Task::factory()->create();
        $this->addTask($first, $build, 'add-build-task');
        $this->addTask($second, $check, 'add-check-task');

        $started = $this->journal->mcpTool(
            $this->caller,
            'plans_start',
            ['plan_id' => $id, 'request_key' => 'start-plan'],
        )->assertOk();
        $this->assertFalse($started->json('result.isError'), $started->getContent());
        $started->assertJsonPath('result.structuredContent.state', 'started');
        $this->journal->mcpTool($this->caller, 'phases_read', ['phase_id' => $first])->assertOk()
            ->assertJsonPath('result.structuredContent.task_ids', [$build->id]);
        $this->journal->actAsUserId(($this->ownerId));
        $bus = $this->app->make(CommandBus::class);
        $bus->run(new FinishTaskCommand($build->id, 0, 'Done.'));
        $bus->run(new FinishTaskCommand($check->id, 0, 'Done.'));

        $read = $this->journal->mcpTool(
            $this->caller,
            'plans_read',
            ['plan_id' => $id, 'view' => 'context'],
        )->assertOk()
            ->assertJsonPath('result.structuredContent.progress.finished', 2)
            ->assertJsonPath('result.structuredContent.progress.total', 2)
            ->assertJsonPath('result.structuredContent.phases.0.phase_id', $first)
            ->assertJsonPath('result.structuredContent.phases.1.phase_id', $second)
            ->json('result.structuredContent');
        $this->assertSame($read, $this->resource("journal://v1/plans/{$id}?view=context"));

        $finish = [
            'plan_id' => $id,
            'expected_revision' => $read['revision'],
            'note' => 'Release complete.',
            'request_key' => 'finish-plan',
        ];
        $this->journal->mcpTool($this->caller, 'plans_finish', $finish)->assertOk()
            ->assertJsonPath('result.isError', false)->assertJsonPath('result.structuredContent.state', 'done');
        $this->journal->agentCall(
            $this->caller,
            'POST',
            '/agent/plans/finish',
            $finish,
        )->assertOk()->assertJsonPath('plan_id', $id);
        $this->journal->mcpTool($this->caller, 'plans_read', ['plan_id' => $id, 'view' => 'context'])->assertOk()
            ->assertJsonPath('result.structuredContent.finish_note', self::RELEASE_NOTE);
    }

    public function test_plan_edits_and_cancellation_respect_the_read_revision(): void
    {
        $plan = Plan::factory()->create();
        $this->journal->mcpTool($this->caller, 'plans_edit', [
            'plan_id' => $plan->id,
            'expected_revision' => 1,
            'title' => 'New title',
            'type' => 'fix',
            'request_key' => 'edit-plan',
        ])->assertOk()->assertJsonPath('result.structuredContent.revision', 2);
        $this->journal->agentCall($this->caller, 'POST', '/agent/plans/cancel', [
            'plan_id' => $plan->id,
            'expected_revision' => 2,
            'reason' => 'Work moved elsewhere.',
            'request_key' => 'cancel-plan',
        ])->assertOk();

        $this->journal->mcpTool($this->caller, 'plans_read', ['plan_id' => $plan->id, 'view' => 'context'])->assertOk()
            ->assertJsonPath('result.structuredContent.title', self::PLAN_TITLE)
            ->assertJsonPath('result.structuredContent.type', 'fix')
            ->assertJsonPath('result.structuredContent.cancel_reason', self::CANCEL_REASON);
    }

    public function test_plan_authoring_is_hidden_from_a_writing_helper_while_plan_reads_remain_available(): void
    {
        $helper = TestStart::start('writing-helper');
        $plan = Plan::factory()->create();
        $this->journal->mcpRequest($helper, 'tools/call', [
            'name' => 'plans_create',
            'arguments' => [
                'title' => 'Hidden write', 'brief' => 'No plan', 'type' => 'build', 'request_key' => 'helper-plan',
            ],
        ])->assertBadRequest()->assertJsonPath('error.code', -32602);
        $this->journal->mcpTool($helper, 'plans_read', ['plan_id' => $plan->id])->assertOk()
            ->assertJsonPath('result.structuredContent.plan_id', $plan->id);
        $this->assertSame(1, Plan::query()->count());
    }

    private function phase(string $planId, string $title, string $key): string
    {
        return $this->journal->mcpTool($this->caller, 'phases_create', [
            'plan_id' => $planId, 'title' => $title, 'request_key' => $key,
        ])->assertOk()->assertJsonPath('result.isError', false)->json('result.structuredContent.phase_id');
    }

    private function addTask(string $phaseId, Task $task, string $key): void
    {
        $this->journal->mcpTool($this->caller, 'phases_add_tasks', [
            'phase_id' => $phaseId,
            'expected_revision' => 1,
            'task_ids' => [$task->id],
            'request_key' => $key,
        ])->assertOk()->assertJsonPath('result.isError', false);
    }

    /**
     * @return array<string, mixed>
     */
    private function resource(string $uri): array
    {
        return json_decode(
            $this->journal->mcpRequest($this->caller, 'resources/read', ['uri' => $uri])->assertOk()
                ->json('result.contents.0.text'),
            true,
            flags: JSON_THROW_ON_ERROR,
        );
    }
}
