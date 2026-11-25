<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature\Http;

use App\Contracts\Bus\CommandBus;
use App\Models\Access\User;
use App\Support\Access\AccessSettings;
use Domain\Plans\Commands\StartPlan\StartPlanCommand;
use Domain\Plans\Enums\PlanStatus;
use Domain\Plans\Models\Plan;
use Domain\Plans\Tests\TestCase;
use Illuminate\Testing\TestResponse;
use Inertia\Testing\AssertableInertia;
use Tests\Support\RefreshHookDatabase;

/**
 * Cancelling and finishing a plan from its page: a cancel against a state that changed since it was shown is refused,
 * a cancelled plan's tasks keep their states, and a started plan with nothing unfinished offers Finish plan.
 */
final class PlanEndPageTest extends TestCase
{
    use RefreshHookDatabase;

    private User $owner;

    private Plan $plan;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->plan = Plan::factory()->create(['title' => 'Build the release page']);
        $this->journal->actAsUserId($this->owner->id);
    }

    public function test_a_started_plan_with_nothing_unfinished_offers_finish_and_finishing_shows_done(): void
    {
        $this->app->make(CommandBus::class)->run(new StartPlanCommand($this->plan->id));

        $offered = $this->actingAs($this->owner)->get("/plans/{$this->plan->number}")->assertOk();

        $offered->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.root.children.1.children.1.children.3.children.0.native.props.review.mayFinish', true)
            ->where('page.data.root.children.1.children.1.children.3.children.0.native.props.review.mayCancel', true));

        $this->end('finish', [
            'revision' => $this->plan->revision,
            'state' => 'started',
            'text' => 'Shipped.',
        ])
            ->assertSessionHasNoErrors();

        $this->assertSame(PlanStatus::Done, $this->plan->refresh()->status);
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
