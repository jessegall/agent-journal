<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Domain\Access\AccessSettings;
use App\Domain\Access\Models\User;
use App\Domain\Plans\Api\PlanKind;
use App\Domain\Plans\Api\PlanState;
use App\Domain\Plans\Models\Plan;
use App\Domain\Tasks\Models\Task;
use App\Domain\Web\Http\Middleware\HandleInertiaRequests;
use Illuminate\Http\Request;
use Inertia\Testing\AssertableInertia;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

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
        $this->release = Plan::query()->create(['title' => 'Build the release page', 'kind' => PlanKind::Build]);
        $this->release->addPhase('Read')->addTasks([Task::query()->create(['title' => 'List the plans'])]);
        $this->paused = Plan::query()->create(['title' => 'Compare chat layouts', 'kind' => PlanKind::Research]);
        Plan::query()->whereKey($this->paused->id)->update(['state' => PlanState::Paused->value]);
    }

    public function test_a_guest_is_sent_to_sign_in(): void
    {
        $this->get('/plans')->assertRedirect('/login');
    }

    public function test_the_page_carries_the_cards_as_strings_and_numbers_without_its_seed_or_view(): void
    {
        $this->actingAs($this->owner)->get('/plans')->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Plans')
            ->where('page.plans.pagination.total', 2)
            ->where('page.plans.rows.1.id', (string) $this->release->id)
            ->where('page.plans.rows.1.totalTasks', 1)
            ->where('page.plans.rows.1.phase', 1)
            ->missing('page.plans.rows.1.agent')
            ->where('page.plans.filters.q', '')
            ->missing('page.filters')
            ->missing('page.view')
            ->where('page.plans.selectionMissing', false)
            ->missing('page.plans.selected'));
    }

    public function test_the_search_and_selection_survive_in_the_query_and_the_start_is_offered_by_the_domain_rule(): void
    {
        $this->actingAs($this->owner)->get("/plans?q=release&plan={$this->release->id}")->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.plans.filters.q', 'release')
            ->where('page.plans.filters.plan', (string) $this->release->id)
            ->count('page.plans.rows', 1)
            ->where('page.plans.selected.card.title', 'Build the release page')
            ->where('page.plans.selected.insideResults', true)
            ->where('page.plans.selected.start.planId', (string) $this->release->id));

        $this->actingAs($this->owner)->get("/plans?q=release&plan={$this->paused->id}")->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.plans.selected.insideResults', false)
            ->missing('page.plans.selected.start'));
    }

    public function test_a_selection_that_cannot_be_read_shows_no_title(): void
    {
        $this->actingAs($this->owner)->get('/plans?plan=999999')->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.plans.selectionMissing', true)
            ->missing('page.plans.selected'));
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
            'X-Inertia-Partial-Component' => 'Plans',
            'X-Inertia-Partial-Data' => 'name',
        ])->assertOk()->assertJsonMissingPath('props.page');
    }
}
