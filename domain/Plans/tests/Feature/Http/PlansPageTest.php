<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature\Http;

use App\Http\Middleware\Web\HandleInertiaRequests;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\PlanStructure;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Models\Task;
use Illuminate\Http\Request;
use Inertia\Testing\AssertableInertia;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestIds;

final class PlansPageTest extends TestCase
{
    use RefreshHookDatabase;

    private const string ROWS = 'page.data.root.children.1.children.0.children.1.children.0.rows';

    private const string READER = 'page.data.root.children.1.children.1.children';

    private User $owner;

    private Plan $release;

    private Plan $paused;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->release = Plan::factory()->create(['title' => 'Build the release page', 'type' => PlanType::Build]);

        $this->planStructure()->addTasks(
            $this->planStructure()->addPhase($this->release, 'Read'),
            [Task::factory()->create(['title' => 'List the plans'])->id],
        );

        $this->paused = Plan::factory()->create(['title' => 'Compare chat layouts', 'type' => PlanType::Research]);
        Plan::query()->whereKey($this->paused->id)->update(['state' => PlanState::Paused->value]);
    }

    public function test_a_guest_is_sent_to_sign_in(): void
    {
        $this->get('/plans')->assertRedirect('/login');
    }

    public function test_the_page_lists_the_plans_with_their_counted_progress_and_no_selection(): void
    {
        $this->actingAs($this->owner)->get('/plans')->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->component('layout/DeclaredLayout')
            ->where('page.state', 'ready')
            ->where('page.data.root.children.0.children.1.text', '2')
            ->where(self::ROWS.'.1.key', (string) $this->release->id)
            ->where(self::ROWS.'.1.trailing.0.style', 'counted')
            ->where(self::ROWS.'.1.trailing.0.progress.max', 1)
            ->where('page.data.root.children.1.children.1.key', 'nothing-selected'));
    }

    public function test_search_survives_in_the_query_and_a_plan_opens_beside_the_list_with_its_start(): void
    {
        $this->actingAs($this->owner)->get('/plans?q=release')->assertInertia(fn (AssertableInertia $page) => $page
            ->count(self::ROWS, 1)
            ->where(self::ROWS.'.0.label', 'Build the release page')
            ->where(self::ROWS.'.0.isCurrent', false));

        $this->actingAs($this->owner)->get("/plans/{$this->release->number}")->assertInertia(
            fn (AssertableInertia $page) => $page
                ->where('page.data.root.children.1.children.1.key', 'detail')
                ->where(self::ROWS.'.1.isCurrent', true),
        );
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
            'X-Inertia-Version' => (string) $this->app->make(
                HandleInertiaRequests::class,
            )->version(Request::create('/plans')),
            'X-Inertia-Partial-Component' => 'layout/DeclaredLayout',
            'X-Inertia-Partial-Data' => 'name',
        ])->assertOk()->assertJsonMissingPath('props.page');
    }

    public function test_the_waiting_filter_lists_waiting_plans_under_the_one_plans_page(): void
    {
        Plan::query()->whereKey($this->paused->id)->update(['state' => PlanState::Reviewing->value]);

        $this->actingAs($this->owner)->get('/plans?state=waiting')->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.root.children.0.children.1.text', '1')
            ->where(self::ROWS.'.0.label', 'Compare chat layouts')
            ->where('navigation.current', ['plans.list']));
    }

    public function test_a_plan_has_its_own_record_page_and_opens_in_the_inspector(): void
    {
        $this->actingAs($this->owner)->get(
            "/plans/{$this->release->number}",
        )->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->component('layout/DeclaredLayout')
            ->where(self::READER.'.3.children.0.native.component', 'plans/PlanWindow')
            ->where(self::READER.'.0.text', 'Build the release page')
            ->where('page.state', 'ready')
            ->where(self::READER.'.3.children.0.native.props.card.title', 'Build the release page'));

        $this->actingAs($this->owner)->get(
            "/plans?inspect=plans.plan&plan={$this->release->number}",
        )->assertInertia(fn (AssertableInertia $page) => $page
            ->reloadOnly(
                'inspector',
                fn (AssertableInertia $reload) => $reload->where(
                    'inspector.data.root.children.1.children.1.children.3.children.0.native.props.card.title',
                    'Build the release page',
                ),
            ));
    }

    public function test_a_phase_has_its_own_page_within_its_plan(): void
    {
        $task = Task::query()->where('title', 'List the plans')->firstOrFail();

        $this->actingAs($this->owner)->get(
            "/plans/{$this->release->number}/phases/1",
        )->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->component('plans/PhaseWindow')
            ->where('page.data.planNumber', (string) $this->release->number)
            ->where('page.data.number', '1')
            ->where('page.data.title', 'Read')
            ->where('page.data.tasks.rows.0.number', (string) $task->number)
            ->where('page.data.tasks.rows.0.title', 'List the plans')
            ->where('page.data.tasks.revision', 2)
            ->missing('page.data.tasks.nextAfter')
            ->where('page.data.finishedTasks', 0)
            ->where('page.data.cancelledTasks', 0)
            ->where('page.data.totalTasks', 1)
            ->where('page.data.isCurrent', true)
            ->where('page.data.canRunChecks', true)
            ->missing('page.data.checkReceipt'));

        $this->actingAs($this->owner)->get("/plans/{$this->paused->number}/phases/1")->assertNotFound();
        $this->actingAs($this->owner)->get("/plans/{$this->release->number}/phases/2")->assertNotFound();
    }

    public function test_a_plan_that_cannot_be_read_is_not_found(): void
    {
        $this->actingAs($this->owner)->get('/plans/'.TestIds::of(999999))->assertNotFound();
        $this->actingAs($this->owner)->get('/plans/0')->assertNotFound();
    }

    private function planStructure(): PlanStructure
    {
        return $this->app->make(PlanStructure::class);
    }
}
