<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature\Http;

use App\Contracts\Bus\CommandBus;
use App\Models\Access\User;
use App\Support\Access\AccessSettings;
use Domain\Plans\Exceptions\PlanUnderReview;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\PlanStructure;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Commands\EditTask\EditTaskCommand;
use Domain\Tasks\Models\Task;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Inertia\Testing\AssertableInertia;
use Tests\Support\RefreshHookDatabase;

/**
 * A plan's review from its page: a coordinator asks for it, a decider approves the frozen edition and the reader shows
 * the receipt with Start still its own action; a decision after a member changed is refused and approves nothing.
 */
final class PlanReviewPageTest extends TestCase
{
    use RefreshHookDatabase;

    private User $owner;

    private Plan $plan;

    private Task $task;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->plan = Plan::factory()->create(['title' => 'Build the release page']);
        $this->task = Task::factory()->create([
            'title' => 'Write',
            'brief' => 'Write the page.',
        ]);
        $this->journal->actAsUserId($this->owner->id);
        $structure = $this->app->make(PlanStructure::class);
        $structure->addTasks($structure->addPhase($this->plan, 'Writing'), [$this->task->id]);
    }

    public function test_a_review_is_asked_for_and_approved_from_the_page_and_start_stays_its_own_action(): void
    {
        $this->postReview('review')->assertStatus(303)->assertSessionHasNoErrors();

        $reviewing = $this->actingAs($this->owner)->get("/plans/{$this->plan->number}")->assertOk();

        $reviewing->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.root.children.1.children.1.children.3.children.0.native.props.review.reviewNumber', 1)
            ->where('page.data.root.children.1.children.1.children.3.children.0.native.props.review.mayDecide', true)
            ->missing('page.data.root.children.1.children.1.children.3.children.0.native.props.card.start'));

        $this->postReview('review/approve', ['edition' => 1])->assertStatus(303)->assertSessionHasNoErrors();

        $approved = $this->actingAs($this->owner)->get("/plans/{$this->plan->number}")->assertOk();

        $approved->assertInertia(fn (AssertableInertia $page) => $page
            ->where(
                'page.data.root.children.1.children.1.children.3.children.0.native.props.review.receipt.editionNumber',
                1,
            )
            ->where(
                'page.data.root.children.1.children.1.children.3.children.0.native.props.review.receipt.isHistorical',
                false,
            )
            ->where(
                'page.data.root.children.1.children.1.children.3.children.0.native.props.review.receipt.decidedById',
                $this->owner->id,
            )
            ->where(
                'page.data.root.children.1.children.1.children.3.children.0.native.props.card.start.planNumber',
                (string) $this->plan->number,
            ));
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
