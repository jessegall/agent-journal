<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature\Http;

use App\Http\Middleware\Web\HandleInertiaRequests;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Models\Task;
use Illuminate\Http\Request;
use Inertia\Testing\AssertableInertia;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestIds;

final class PlansPageTest extends TestCase
{
    use RefreshHookDatabase;

    private User $owner;

    private Plan $release;

    private Plan $paused;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->release = Plan::query()->create(['title' => 'Build the release page', 'type' => PlanType::Build]);
        $this->release->addPhase('Read')->addTasks([Task::query()->create(['title' => 'List the plans'])->id]);
        $this->paused = Plan::query()->create(['title' => 'Compare chat layouts', 'type' => PlanType::Research]);
        Plan::query()->whereKey($this->paused->id)->update(['state' => PlanState::Paused->value]);
    }

    public function test_a_guest_is_sent_to_sign_in(): void
    {
        $this->get('/plans')->assertRedirect('/login');
    }

    public function test_the_page_carries_the_cards_as_strings_and_numbers_without_its_seed_or_view(): void
    {
        $this->actingAs($this->owner)->get('/plans')->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->component('plans/PlansWindow')
            ->where('page.state', 'ready')
            ->where('page.data.pagination.total', 2)
            ->where('page.data.rows.1.id', (string) $this->release->id)
            ->where('page.data.rows.1.totalTasks', 1)
            ->where('page.data.rows.1.phase', 1)
            ->missing('page.data.rows.1.holder')
            ->where('page.data.filters.q', '')
            ->where('page.data.selectionMissing', false)
            ->missing('page.data.selected'));
    }

    public function test_the_search_and_selection_survive_in_the_query_and_the_start_is_offered_by_the_domain_rule(): void
    {
        $this->actingAs($this->owner)->get("/plans?q=release&plan={$this->release->id}")->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.filters.q', 'release')
            ->where('page.data.filters.plan', (string) $this->release->id)
            ->count('page.data.rows', 1)
            ->where('page.data.selected.card.title', 'Build the release page')
            ->where('page.data.selected.insideResults', true)
            ->where('page.data.selected.start.planId', (string) $this->release->id));

        $this->actingAs($this->owner)->get("/plans?q=release&plan={$this->paused->id}")->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.selected.insideResults', false)
            ->missing('page.data.selected.start'));
    }

    public function test_a_selection_that_cannot_be_read_shows_no_title(): void
    {
        $this->actingAs($this->owner)->get('/plans?plan='.TestIds::of(999999))->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.selectionMissing', true)
            ->missing('page.data.selected'));
    }

    public function test_invalid_filters_are_refused(): void
    {
        $this->actingAs($this->owner)->from('/plans')->get('/plans?q='.str_repeat('a', 201).'&page=0&plan=-3')
            ->assertRedirect('/plans')
            ->assertSessionHasErrors(['q', 'page', 'plan']);
    }

    public function test_a_partial_reload_of_other_props_does_not_build_the_page(): void
    {
        $this->actingAs($this->owner)->get('/plans', [
            'X-Inertia' => 'true',
            'X-Inertia-Version' => (string) $this->app->make(HandleInertiaRequests::class)->version(Request::create('/plans')),
            'X-Inertia-Partial-Component' => 'plans/PlansWindow',
            'X-Inertia-Partial-Data' => 'name',
        ])->assertOk()->assertJsonMissingPath('props.page');
    }

    public function test_the_state_children_list_open_waiting_and_closed_plans_and_count_them(): void
    {
        Plan::query()->whereKey($this->paused->id)->update(['state' => PlanState::Reviewing->value]);

        $this->actingAs($this->owner)->get('/plans?state=waiting')->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.filters.state', 'waiting')
            ->where('page.data.pagination.total', 1)
            ->where('page.data.rows.0.title', 'Compare chat layouts')
            ->where('navigation.current', ['plans.list', 'plans.waiting'])
            ->loadDeferredProps('navigation-counts', fn (AssertableInertia $counts) => $counts
                ->where('navigationCounts.counts', fn ($counts) => $counts['plans.open'] === 1 && $counts['plans.waiting'] === 1)));
    }

    public function test_a_plan_has_its_own_record_page_and_opens_in_the_inspector(): void
    {
        $this->actingAs($this->owner)->get("/plans/{$this->release->id}")->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->component('plans/PlanWindow')
            ->where('page.state', 'ready')
            ->where('page.data.card.title', 'Build the release page'));

        $this->actingAs($this->owner)->get("/plans?inspect=plans.plan&plan={$this->release->id}")->assertInertia(fn (AssertableInertia $page) => $page
            ->reloadOnly('inspector', fn (AssertableInertia $reload) => $reload->where('inspector.data.card.title', 'Build the release page')));
    }

    public function test_a_plan_that_cannot_be_read_is_not_found(): void
    {
        $this->actingAs($this->owner)->get('/plans/'.TestIds::of(999999))->assertNotFound();
        $this->actingAs($this->owner)->get('/plans/0')->assertNotFound();
    }
}
