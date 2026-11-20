<?php

declare(strict_types=1);

namespace Tests\Feature\Mcp;

use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Models\Plan;
use Domain\Tasks\Models\Task;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsMcpFrames;
use Tests\Support\SendsSignedCalls;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

#[TimeLimit(8, 'The plan journeys cross several signed requests and inspect persisted outcomes.')]
final class PlanToolsTest extends TestCase
{
    use CommitsHookRows;
    use SendsMcpFrames;
    use SendsSignedCalls;

    private const array TABLES = [
        'users', 'agents', 'agent_sessions', 'agent_stacks', 'start_tokens',
        'tasks', 'plans', 'phases', 'phase_tasks', 'assignments', 'command_receipts',
    ];

    private TestStart $caller;

    protected function setUp(): void
    {
        parent::setUp();

        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->caller = TestStart::start();
    }

    public function test_an_agent_builds_starts_reads_and_finishes_a_plan_across_the_two_surfaces(): void
    {
        $create = [
            'title' => 'Release', 'brief' => 'Ship the release.', 'type' => 'build', 'request_key' => 'make-plan',
        ];
        $id = $this->callMcpTool($this->caller, 'plans_create', $create)
            ->assertJsonPath('result.isError', false)->json('result.structuredContent.plan_id');
        $this->signed($this->caller, '/agent/plans/create', $create)->assertOk()->assertJsonPath('plan_id', $id);
        $first = $this->phase($id, 'Build', 'make-build-phase');
        $second = $this->phase($id, 'Check', 'make-check-phase');
        $build = Task::factory()->create();
        $check = Task::factory()->create();
        $this->addTask($first, $build, 'add-build-task');
        $this->addTask($second, $check, 'add-check-task');

        $started = $this->callMcpTool($this->caller, 'plans_start', ['plan_id' => $id, 'request_key' => 'start-plan']);
        $this->assertFalse($started->json('result.isError'), $started->getContent());
        $started->assertJsonPath('result.structuredContent.state', 'started');
        $this->callMcpTool($this->caller, 'phases_read', ['phase_id' => $first])
            ->assertJsonPath('result.structuredContent.task_ids', [$build->id]);
        $build->finish();
        $check->finish();

        $read = $this->callMcpTool($this->caller, 'plans_read', ['plan_id' => $id, 'view' => 'context'])
            ->assertJsonPath('result.structuredContent.progress.done', 2)
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
        $this->callMcpTool($this->caller, 'plans_finish', $finish)
            ->assertJsonPath('result.isError', false)->assertJsonPath('result.structuredContent.state', 'done');
        $this->signed($this->caller, '/agent/plans/finish', $finish)->assertOk()->assertJsonPath('plan_id', $id);
        $this->callMcpTool($this->caller, 'plans_read', ['plan_id' => $id, 'view' => 'context'])
            ->assertJsonPath('result.structuredContent.finish_note', 'Release complete.');
    }

    public function test_an_ineligible_start_returns_the_domain_refusal(): void
    {
        $plan = Plan::factory()->create(['state' => PlanState::Cancelled]);

        $this->callMcpTool($this->caller, 'plans_start', ['plan_id' => $plan->id, 'request_key' => 'cancelled-start'])
            ->assertJsonPath('result.isError', true)
            ->assertJsonPath('result.structuredContent.code', 'forbidden')
            ->assertJsonPath(
                'result.structuredContent.message',
                'This plan is cancelled and cannot start; only a planned plan starts.',
            );
        $this->assertSame(PlanState::Cancelled, $plan->refresh()->state);
    }

    public function test_plan_edits_and_cancellation_respect_the_read_revision(): void
    {
        $plan = Plan::factory()->create();
        $this->callMcpTool($this->caller, 'plans_edit', [
            'plan_id' => $plan->id,
            'expected_revision' => 1,
            'title' => 'New title',
            'type' => 'fix',
            'request_key' => 'edit-plan',
        ])->assertJsonPath('result.structuredContent.revision', 2);
        $this->signed($this->caller, '/agent/plans/cancel', [
            'plan_id' => $plan->id,
            'expected_revision' => 2,
            'reason' => 'Work moved elsewhere.',
            'request_key' => 'cancel-plan',
        ])->assertOk();

        $this->callMcpTool($this->caller, 'plans_read', ['plan_id' => $plan->id, 'view' => 'context'])
            ->assertJsonPath('result.structuredContent.title', 'New title')
            ->assertJsonPath('result.structuredContent.type', 'fix')
            ->assertJsonPath('result.structuredContent.cancel_reason', 'Work moved elsewhere.');
    }

    public function test_plan_authoring_is_hidden_from_a_writing_helper_while_plan_reads_remain_available(): void
    {
        $helper = TestStart::start('writing-helper');
        $plan = Plan::factory()->create();
        $this->sendMcp($helper, 'tools/call', [
            'name' => 'plans_create',
            'arguments' => [
                'title' => 'Hidden write', 'brief' => 'No plan', 'type' => 'build', 'request_key' => 'helper-plan',
            ],
        ])->assertBadRequest()->assertJsonPath('error.code', -32602);
        $this->callMcpTool($helper, 'plans_read', ['plan_id' => $plan->id])
            ->assertJsonPath('result.structuredContent.plan_id', $plan->id);
        $this->assertSame(1, Plan::query()->count());
    }

    private function phase(string $planId, string $title, string $key): string
    {
        return $this->callMcpTool($this->caller, 'phases_create', [
            'plan_id' => $planId, 'title' => $title, 'request_key' => $key,
        ])->assertJsonPath('result.isError', false)->json('result.structuredContent.phase_id');
    }

    private function addTask(string $phaseId, Task $task, string $key): void
    {
        $this->callMcpTool($this->caller, 'phases_add_tasks', [
            'phase_id' => $phaseId,
            'expected_revision' => 1,
            'task_ids' => [$task->id],
            'request_key' => $key,
        ])->assertJsonPath('result.isError', false);
    }

    /** @return array<string, mixed> */
    private function resource(string $uri): array
    {
        return json_decode(
            $this->sendMcp($this->caller, 'resources/read', ['uri' => $uri])->assertOk()
                ->json('result.contents.0.text'),
            true,
            flags: JSON_THROW_ON_ERROR,
        );
    }
}
