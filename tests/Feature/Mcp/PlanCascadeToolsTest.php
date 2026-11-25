<?php

declare(strict_types=1);

namespace Tests\Feature\Mcp;

use App\Exceptions\AssignmentRootFinished;
use App\Models\Access\User;
use App\Models\Records\AssignmentRecord;
use App\Support\Access\AccessSettings;
use App\Support\RecordIdentity;
use Domain\Plans\Enums\PlanStatus;
use Domain\Plans\Models\Plan;
use Domain\Plans\PlansDomain;
use Domain\Plans\Support\PlanStructure;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\SendsMcpFrames;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

final class PlanCascadeToolsTest extends TestCase
{
    use CommitsHookRows;
    use SendsMcpFrames;

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

    private TestStart $recipient;

    protected function setUp(): void
    {
        parent::setUp();

        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->caller = TestStart::start();
        $this->recipient = TestStart::start('writing-helper');
    }

    #[TimeLimit(5, 'It writes a cascade and follows the continuation of the real operation receipt.')]
    public function test_a_cascade_skips_finished_work_and_the_receipt_lists_every_outcome(): void
    {
        $plan = Plan::factory()->create();
        $phase = $this->planStructure()->addPhase($plan, 'Release');
        $tasks = Task::factory()->count(20)->create();
        $finished = Task::factory()->create();
        $finished->finish('Done.');
        $this->planStructure()->addTasks($phase, [...$tasks->modelKeys(), $finished->id]);

        $summary = $this->callMcpTool($this->caller, 'plans_assign_work', $this->assignArguments($plan))
            ->assertJsonPath('result.isError', false)
            ->assertJsonPath('result.structuredContent.changed', 22)
            ->assertJsonPath('result.structuredContent.unchanged', 0)
            ->assertJsonPath('result.structuredContent.skipped_finished', 1)
            ->assertJsonPath('result.structuredContent.next_actions.0.tool', 'operations_read')
            ->json('result.structuredContent');
        $outcomes = [];
        $actions = $summary['next_actions'];

        for ($page = 0; $page < 23 && $actions !== []; $page++) {
            $reply = $this->callMcpTool($this->caller, $actions[0]['tool'], $actions[0]['arguments']);
            $this->assertFalse($reply->json('result.isError'), $reply->getContent());
            $receipt = $reply->assertJsonPath('result.structuredContent.outcome_count', 23)
                ->assertJsonPath('result.structuredContent.outcome_offset', count($outcomes))
                ->json('result.structuredContent');
            $this->assertNotEmpty($receipt['outcomes']);
            $outcomes = [...$outcomes, ...$receipt['outcomes']];
            $actions = $receipt['next_actions'];
        }

        $this->assertSame([], $actions);

        $this->assertEqualsCanonicalizing(
            [$plan->id, $phase->id, ...$tasks->modelKeys(), $finished->id],
            array_column(array_column($outcomes, 'record'), 'id'),
        );
        $this->assertDatabaseCount('assignments', 22);
    }

    public function test_reassign_and_unassign_use_the_expected_root_reference(): void
    {
        $plan = Plan::factory()->create();
        $other = TestStart::start('writing-helper');
        $arguments = $this->assignArguments($plan);
        $this->callMcpTool($this->caller, 'plans_assign_work', $arguments)
            ->assertJsonPath('result.structuredContent.changed', 1);
        $first = $this->reference($plan);

        $this->callMcpTool($this->caller, 'plans_reassign_work', [
            'root' => $arguments['root'],
            'expected_assignment' => $first,
            'recipient' => ['type' => 'agent', 'id' => $other->agent->id],
            'request_key' => 'move-plan',
        ])->assertJsonPath('result.structuredContent.changed', 1);
        $second = $this->reference($plan);
        $this->assertSame($other->agent->id, $second['holder']['id']);

        $this->callMcpTool($this->caller, 'plans_unassign_work', [
            'root' => $arguments['root'],
            'expected_assignment' => $second,
            'request_key' => 'release-plan',
        ])->assertJsonPath('result.structuredContent.changed', 1);
        $this->assertSame(0, AssignmentRecord::query()->count());
    }

    public function test_a_finished_root_is_refused_with_a_recovery_action(): void
    {
        $plan = Plan::factory()->create(['status' => PlanStatus::Done]);

        $this->callMcpTool($this->caller, 'plans_assign_work', $this->assignArguments($plan))
            ->assertJsonPath('result.isError', true)
            ->assertJsonPath('result.structuredContent.next_action.tool', 'plans_read')
            ->assertJsonPath('result.structuredContent.next_action.arguments.plan_id', $plan->id)
            ->assertJsonPath('result.structuredContent.code', 'invalid_input')
            ->assertJsonPath(
                'result.structuredContent.message',
                AssignmentRootFinished::for(new RecordIdentity('plans.plan', $plan->id))->getMessage(),
            );
        $this->assertSame(0, AssignmentRecord::query()->count());
    }

    /**
     * @return array{root: array{type: string, id: string}, recipient: array{type: string, id: string}, request_key: string}
     */
    private function assignArguments(Plan $plan): array
    {
        return [
            'root' => ['type' => 'plans.plan', 'id' => $plan->id],
            'recipient' => ['type' => 'agent', 'id' => $this->recipient->agent->id],
            'request_key' => 'assign-plan',
        ];
    }

    /**
     * @return array{id: string, holder: array{type: string, id: string}}
     */
    private function reference(Plan $plan): array
    {
        $holder = $this->callMcpTool(
            $this->caller,
            'assignments_read',
            ['record_type' => 'plans.plan', 'record_id' => $plan->id],
        )->json('result.structuredContent.holder');

        return ['id' => $holder['reference'], 'holder' => ['type' => $holder['type'], 'id' => $holder['id']]];
    }

    private function planStructure(): PlanStructure
    {
        return $this->app->make(PlanStructure::class);
    }
}
