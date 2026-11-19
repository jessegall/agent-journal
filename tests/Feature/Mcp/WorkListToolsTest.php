<?php

declare(strict_types=1);

namespace Tests\Feature\Mcp;

use App\Assignments\Support\AssigneeIdentity;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Domain\Tasks\Models\Task;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\AssignmentWriterInTransaction;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsMcpFrames;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * tasks_assigned, plans_assigned and plans_list map their arguments to the owners' readers and continue a page the
 * byte budget shortened with its omitted entries.
 */
final class WorkListToolsTest extends TestCase
{
    use CommitsHookRows;
    use SendsMcpFrames;
    use StartsAgentRequests;

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'start_tokens',
        'tasks',
        'plans',
        'phases',
        'assignments',
        'agent_stacks',
        'core_mcp_retained_pages',
    ];

    private TestStart $caller;

    private AssignmentWriterInTransaction $writer;

    protected function setUp(): void
    {
        parent::setUp();

        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->caller = TestStart::start();
        $this->startUserRequestAs($owner->id);
        $this->writer = $this->app->make(AssignmentWriterInTransaction::class);
    }

    public function test_an_agent_holding_two_tasks_gets_exactly_those_with_their_references_and_no_continuation(): void
    {
        $references = [];

        $tasks = Task::factory()->count(2)->sequence(
            ['title' => 'Write the tool'],
            ['title' => 'Test the tool'],
        )->create();

        foreach ($tasks as $task) {
            $references[$task->id] = $this->writer->assign(
                $task->assignmentIdentity(),
                AssigneeIdentity::of($this->caller->agent),
            )->outcomes[0]->current->reference->id;
        }

        $other = TestStart::start();
        $this->writer->assign(
            Task::factory()->create(['title' => 'Not yours'])->assignmentIdentity(),
            AssigneeIdentity::of($other->agent),
        );

        $result = $this->callMcpTool(
            $this->caller,
            'tasks_assigned',
        )->assertJsonPath('result.isError', false)->json('result.structuredContent');

        $this->assertSame(2, $result['total']);
        $this->assertEquals(
            $references,
            array_combine(
                array_column($result['cards'], 'id'),
                array_column(array_column($result['cards'], 'holder'), 'reference'),
            ),
        );
        $this->assertSame([], $result['next_actions']);
    }

    public function test_an_agent_holding_nothing_gets_an_empty_list_and_no_continuation(): void
    {
        $result = $this->callMcpTool($this->caller, 'tasks_assigned')->json('result.structuredContent');

        $this->assertSame([], $result['cards']);
        $this->assertSame(0, $result['total']);
        $this->assertSame([], $result['next_actions']);
    }

    public function test_a_held_plan_appears_in_plans_assigned_with_its_state_and_progress(): void
    {
        $plan = Plan::factory()->create(['title' => 'Release', 'type' => PlanType::Build]);
        $this->writer->assign($plan->assignmentIdentity(), AssigneeIdentity::of($this->caller->agent));

        $card = $this->callMcpTool($this->caller, 'plans_assigned')->json('result.structuredContent.cards.0');

        $this->assertSame('Release', $card['title']);
        $this->assertSame($plan->state->value, $card['state']);
        $this->assertSame([0, 0], [$card['doneTasks'], $card['totalTasks']]);
    }

    public function test_plans_list_refuses_per_page(): void
    {
        $this->callMcpTool($this->caller, 'plans_list', ['per_page' => 50])
            ->assertJsonPath('result.isError', true)
            ->assertJsonPath('result.structuredContent.code', 'invalid_input')
            ->assertSee('per_page');
    }

    public function test_a_page_cut_by_the_byte_budget_continues_with_its_omitted_entries(): void
    {
        $held = [];

        for ($number = 1; $number <= 20; $number++) {
            $task = Task::factory()->create(['title' => str_pad("Task {$number} ", 238, 'x')]);
            $this->writer->assign($task->assignmentIdentity(), AssigneeIdentity::of($this->caller->agent));
            $held[] = $task->id;
        }

        $first = $this->callMcpTool($this->caller, 'tasks_assigned')->json('result.structuredContent');
        $this->assertLessThan(20, count($first['cards']));
        $this->assertSame('tasks_assigned', $first['next_actions'][0]['tool']);
        $this->assertSame(['continuation'], array_keys($first['next_actions'][0]['arguments']));

        $seen = array_column($first['cards'], 'id');
        $next = $first['next_actions'];

        while ($next !== []) {
            $page = $this->callMcpTool(
                $this->caller,
                'tasks_assigned',
                $next[0]['arguments'],
            )->assertJsonPath('result.isError', false)->json('result.structuredContent');
            $seen = [...$seen, ...array_column($page['cards'], 'id')];
            $next = $page['next_actions'];
        }

        $this->assertSame(array_unique($seen), $seen);
        $this->assertEqualsCanonicalizing($held, $seen);
    }

    public function test_a_continuation_sent_with_a_page_is_invalid_input(): void
    {
        $this->callMcpTool($this->caller, 'tasks_assigned', ['continuation' => 'cursor', 'page' => 2])
            ->assertJsonPath('result.isError', true)
            ->assertJsonPath('result.structuredContent.code', 'invalid_input');
    }
}
