<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature\Http;

use App\Bus\Contracts\CommandBus;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Plans\Commands\StartPlan;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\PlanStructure;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Models\Task;
use Illuminate\Testing\TestResponse;
use Inertia\Testing\AssertableInertia;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;

/**
 * Cancelling and finishing a plan from its page: a cancel against a state that changed since it was shown is refused,
 * a cancelled plan's tasks keep their states, and a started plan with nothing unfinished offers Finish plan.
 */
final class PlanEndPageTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;

    private User $owner;

    private Plan $plan;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->plan = Plan::factory()->create(['title' => 'Build the release page']);
        $this->startUserRequestAs($this->owner->id);
    }

    public function test_a_cancel_against_a_changed_state_is_refused_and_a_cancelled_plan_keeps_its_tasks(): void
    {
        $task = Task::factory()->create();
        $structure = $this->app->make(PlanStructure::class);
        $structure->addTasks($structure->addPhase($this->plan, 'Work'), [$task->id]);
        $this->app->make(CommandBus::class)->run(new StartPlan($this->plan->id));

        $this->end('cancel', ['revision' => $this->plan->revision, 'state' => 'planned', 'text' => 'Dropped.'])
            ->assertSessionHasErrors();

        $this->assertSame(PlanState::Started, $this->plan->refresh()->state);

        $this->end('cancel', ['revision' => $this->plan->revision, 'state' => 'started', 'text' => 'Dropped.'])
            ->assertSessionHasNoErrors();

        $this->assertSame(PlanState::Cancelled, $this->plan->refresh()->state);
        $this->assertSame(TaskState::Open, $task->refresh()->state);
    }

    public function test_a_started_plan_with_nothing_unfinished_offers_finish_and_finishing_shows_done(): void
    {
        $this->app->make(CommandBus::class)->run(new StartPlan($this->plan->id));

        $offered = $this->actingAs($this->owner)->get("/plans/{$this->plan->number}")->assertOk();

        $offered->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.root.children.1.children.1.children.3.children.0.native.props.review.mayFinish', true)
            ->where('page.data.root.children.1.children.1.children.3.children.0.native.props.review.mayCancel', true));

        $this->end('finish', ['revision' => $this->plan->revision, 'state' => 'started', 'text' => 'Shipped.'])
            ->assertSessionHasNoErrors();

        $this->assertSame(PlanState::Done, $this->plan->refresh()->state);
    }

    /**
     * @param  array<string, mixed>  $fields
     */
    private function end(string $action, array $fields): TestResponse
    {
        return $this->actingAs($this->owner)->from("/plans/{$this->plan->number}")
            ->post("/plans/{$this->plan->number}/{$action}", $fields);
    }
}
