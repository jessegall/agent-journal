<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature\Http;

use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Domain\Plans\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;

final class StartPlanTest extends TestCase
{
    use CommitsHookRows;

    /**
     * The start runs on the bus and commits for real, so these tables are emptied around each test.
     */
    private const array TABLES = ['users', 'plans', 'phases', 'phase_tasks', 'tasks'];

    private User $owner;

    private Plan $plan;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->plan = Plan::query()->create(['title' => 'Build the release page', 'type' => PlanType::Build]);
    }

    public function test_a_start_returns_to_the_page_it_came_from(): void
    {
        $this->actingAs($this->owner)->from("/plans?q=release&page=2&plan={$this->plan->id}")
            ->post("/plans/{$this->plan->id}/start", ['redirect' => 'https://example.com'])
            ->assertStatus(303)
            ->assertRedirect("/plans?q=release&page=2&plan={$this->plan->id}");

        $this->assertSame(PlanState::Started, $this->plan->fresh()?->state);
    }

    public function test_a_start_from_home_returns_to_home_with_every_windows_query(): void
    {
        $this->actingAs($this->owner)->from("/?q=release&plan={$this->plan->id}&rules_q=phase")
            ->post("/plans/{$this->plan->id}/start")
            ->assertStatus(303)
            ->assertRedirect("/?q=release&plan={$this->plan->id}&rules_q=phase");

        $this->assertSame(PlanState::Started, $this->plan->fresh()?->state);
    }

    public function test_a_refused_start_shows_its_reason_and_changes_nothing(): void
    {
        Plan::query()->whereKey($this->plan->id)->update(['state' => PlanState::Paused->value]);

        $this->actingAs($this->owner)->from('/plans')
            ->post("/plans/{$this->plan->id}/start")
            ->assertStatus(303)
            ->assertRedirect('/plans')
            ->assertSessionHasErrors(['start' => 'This plan is paused and cannot start; only a planned plan starts.']);

        $this->assertSame(PlanState::Paused, $this->plan->fresh()?->state);
    }

    public function test_an_id_that_is_no_positive_whole_number_in_range_is_not_found(): void
    {
        foreach (['abc', '0', '-3', '9223372036854775808', '99999999999999999999'] as $id) {
            $this->actingAs($this->owner)->post("/plans/{$id}/start")->assertNotFound();
        }

        $this->assertSame(PlanState::Planned, $this->plan->fresh()?->state);
    }

    public function test_a_guest_and_a_guessed_plan_get_no_start(): void
    {
        $this->post("/plans/{$this->plan->id}/start")->assertRedirect('/login');
        $this->actingAs($this->owner)->post('/plans/'.TestIds::of(999999).'/start')->assertNotFound();

        $this->assertSame(PlanState::Planned, $this->plan->fresh()?->state);
    }
}
