<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature\Http;

use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\PlanStructure;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Models\Task;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Inertia\Testing\AssertableInertia;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;

/**
 * A plan's review from its page: a coordinator asks for it, a decider approves the frozen edition and the reader shows
 * the receipt with Start still its own action; a decision after a member changed is refused and approves nothing.
 */
final class PlanReviewPageTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;

    private User $owner;

    private Plan $plan;

    private Task $task;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->plan = Plan::factory()->create(['title' => 'Build the release page']);
        $this->task = Task::factory()->create(['title' => 'Write', 'brief' => 'Write the page.']);
        $this->startUserRequestAs($this->owner->id);
        $structure = $this->app->make(PlanStructure::class);
        $structure->addTasks($structure->addPhase($this->plan, 'Writing'), [$this->task->id]);
    }

    public function test_a_review_is_asked_for_and_approved_from_the_page_and_start_stays_its_own_action(): void
    {
        $this->postReview('review')->assertStatus(303)->assertSessionHasNoErrors();

        $reviewing = $this->actingAs($this->owner)->get("/plans/{$this->plan->number}")->assertOk();

        $reviewing->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.root.children.2.native.props.review.edition.number', 1)
            ->where('page.data.root.children.2.native.props.review.edition.phases.0.members.0.brief', 'Write the page.')
            ->where('page.data.root.children.2.native.props.review.mayDecide', true)
            ->missing('page.data.root.children.2.native.props.card.start'));

        $this->postReview('review/approve', ['edition' => 1])->assertStatus(303)->assertSessionHasNoErrors();

        $approved = $this->actingAs($this->owner)->get("/plans/{$this->plan->number}")->assertOk();

        $approved->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.root.children.2.native.props.review.receipt.editionNumber', 1)
            ->where('page.data.root.children.2.native.props.review.receipt.isHistorical', false)
            ->where('page.data.root.children.2.native.props.review.receipt.decidedById', $this->owner->id)
            ->where('page.data.root.children.2.native.props.card.start.planNumber', (string) $this->plan->number));
    }

    public function test_a_decision_after_a_member_changed_is_refused_and_approves_nothing(): void
    {
        $this->postReview('review')->assertStatus(303);
        $this->task->describe('Write', 'Write the new page.');

        $this->postReview('review/approve', ['edition' => 1])->assertStatus(303)->assertSessionHasErrors();

        $still = $this->actingAs($this->owner)->get("/plans/{$this->plan->number}")->assertOk();

        $still->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.root.children.2.native.props.review.edition.number', 1)
            ->missing('page.data.root.children.2.native.props.review.receipt'));
    }

    /**
     * @param  array<string, mixed>  $fields
     */
    private function postReview(string $action, array $fields = []): TestResponse
    {
        return $this->actingAs($this->owner)->from("/plans/{$this->plan->number}")
            ->withHeader('Idempotency-Key', (string) Str::uuid())
            ->post("/plans/{$this->plan->number}/{$action}", $fields);
    }
}
