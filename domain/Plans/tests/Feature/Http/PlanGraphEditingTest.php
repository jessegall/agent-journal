<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature\Http;

use App\Models\Access\User;
use App\Support\Access\AccessSettings;
use App\Support\ActorIdentity;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\PlanStructure;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskWait;
use Illuminate\Testing\TestResponse;
use Inertia\Testing\AssertableInertia;
use Tests\Support\RefreshHookDatabase;

/**
 * The plan graph's Suggest keeps a suggestion that drops the waits phase order or other waits
 * already imply, Apply makes it as one version-checked change, and Undo puts the earlier waits back.
 */
final class PlanGraphEditingTest extends TestCase
{
    use RefreshHookDatabase;

    private User $owner;

    private Plan $plan;

    /**
     * @var array<string, Task>
     */
    private array $tasks;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->plan = Plan::factory()->create(['title' => 'Ship the graph']);

        $this->tasks = [
            'design' => Task::factory()->create(['title' => 'Design the graph']),
            'build' => Task::factory()->create(['title' => 'Build the graph']),
            'ship' => Task::factory()->create(['title' => 'Ship the graph']),
        ];

        $structure = $this->app->make(PlanStructure::class);
        $structure->addTasks($structure->addPhase($this->plan, 'Design'), [$this->tasks['design']->id]);

        $structure->addTasks(
            $structure->addPhase($this->plan, 'Build'),
            [
                $this->tasks['build']->id,
                $this->tasks['ship']->id,
            ],
        );

        $this->wait('ship', 'design');
        $this->wait('ship', 'build');
        $this->wait('build', 'design');
    }

    public function test_apply_keeps_only_the_waits_phase_order_and_other_waits_do_not_already_give(): void
    {
        $this->graphAction('suggest')->assertRedirect();
        $this->graphAction('apply')->assertRedirect();

        $this->assertSame([[
            'ship',
            'build',
        ]], $this->waits());
        $this->graphAction('apply')->assertSessionHas('refusal_code', 'plan-graph-change-missing');
    }

    public function test_the_graph_read_after_suggest_carries_the_suggestion_and_offers_apply(): void
    {
        $graph = 'page.data.root.children.1.children.1.children.3.children.0.native.props';

        $this->graphAction('suggest');

        $this->actingAs($this->owner)->get("/plans/{$this->plan->number}?tab=graph")
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where("{$graph}.destinations.apply", "/plans/{$this->plan->number}/graph/apply")
                ->has("{$graph}.suggestion.edges", 1)
                ->missing("{$graph}.destinations.undo"));
    }

    public function test_undo_puts_the_earlier_waits_back_once(): void
    {
        $this->graphAction('suggest');
        $this->graphAction('apply');

        $this->graphAction('undo')->assertRedirect();

        $this->assertEqualsCanonicalizing([
            [
                'ship',
                'design',
            ],
            [
                'ship',
                'build',
            ],
            [
                'build',
                'design',
            ],
        ], $this->waits());
        $this->graphAction('undo')->assertSessionHas('refusal_code', 'plan-graph-change-missing');
    }

    public function test_undo_is_refused_once_the_waits_changed_again(): void
    {
        $this->graphAction('suggest');
        $this->graphAction('apply');
        $this->wait('ship', 'design');

        $this->graphAction('undo')->assertSessionHas('refusal_code', 'task-graph-changed');

        $this->assertEqualsCanonicalizing([
            [
                'ship',
                'build',
            ],
            [
                'ship',
                'design',
            ],
        ], $this->waits());
    }

    private function graphAction(string $action): TestResponse
    {
        return $this->actingAs($this->owner)->from("/plans/{$this->plan->number}?tab=graph")
            ->post("/plans/{$this->plan->number}/graph/{$action}", ['planId' => $this->plan->id]);
    }

    private function wait(string $dependent, string $prerequisite): void
    {
        TaskWait::create($this->tasks[$dependent], $this->tasks[$prerequisite], ActorIdentity::system());
    }

    /**
     * @return list<array{string, string}>
     */
    private function waits(): array
    {
        $names = array_flip(array_map(fn (Task $task) => $task->id, $this->tasks));

        return TaskWait::query()->orderBy('created_at')->get()
            ->map(
                fn (TaskWait $wait) => [
                    $names[$wait->dependent_task_id],
                    $names[$wait->prerequisite_task_id],
                ],
            )->all();
    }
}
