<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Domain\Access\Models\User;
use App\Domain\Access\Support\AccessSettings;
use App\Domain\Rules\Actions\ProposeRule;
use App\Domain\Rules\Enums\RuleState;
use App\Domain\Rules\Models\Rule;
use Inertia\Testing\AssertableInertia;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The rules page: the list and reader on one page, and approving or denying the proposed rule it shows.
 */
final class RulesPageTest extends TestCase
{
    use RefreshHookDatabase;

    private User $owner;

    private Rule $proposed;

    private Rule $active;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->active = Rule::query()->create(['text' => 'Write all code in plain English.']);
        $this->proposed = $this->app->make(ProposeRule::class)->propose("Every phase ends with its tests.\n  - run them once");
    }

    public function test_a_guest_is_sent_to_sign_in(): void
    {
        $this->get('/rules')->assertRedirect('/login');
    }

    public function test_the_list_and_the_selected_rule_share_one_page(): void
    {
        $this->actingAs($this->owner)->get("/rules?q=phase&rule={$this->proposed->id}")->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->component('rules/RulesWindow')
            ->where('page.state', 'ready')
            ->where('page.data.pagination.total', 1)
            ->where('page.data.rows.0.id', (string) $this->proposed->id)
            ->where('page.data.rows.0.state', 'proposed')
            ->where('page.data.filters.q', 'phase')
            ->where('page.data.selected.text', "Every phase ends with its tests.\n  - run them once")
            ->where('page.data.selected.canReview', true)
            ->where('page.data.selectionMissing', false)
            ->missing('page.filters')
            ->missing('page.view'));
    }

    public function test_an_unknown_rule_is_missing_without_text(): void
    {
        $this->actingAs($this->owner)->get('/rules?rule=999999')->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.selectionMissing', true)
            ->missing('page.data.selected'));
    }

    public function test_approving_returns_to_the_page_it_came_from(): void
    {
        $this->actingAs($this->owner)->from("/rules?q=phase&rule={$this->proposed->id}")
            ->patch("/rules/{$this->proposed->id}/approve")
            ->assertStatus(303)
            ->assertRedirect("/rules?q=phase&rule={$this->proposed->id}");

        $this->assertSame(RuleState::Active, $this->proposed->fresh()?->state);
    }

    public function test_approving_from_home_returns_to_home_with_every_windows_query(): void
    {
        $this->actingAs($this->owner)->from("/?q=release&rules_q=phase&rule={$this->proposed->id}")
            ->patch("/rules/{$this->proposed->id}/approve")
            ->assertStatus(303)
            ->assertRedirect("/?q=release&rules_q=phase&rule={$this->proposed->id}");

        $this->assertSame(RuleState::Active, $this->proposed->fresh()?->state);
    }

    public function test_denying_settles_the_rule(): void
    {
        $this->actingAs($this->owner)->from('/rules')->patch("/rules/{$this->proposed->id}/deny")->assertRedirect('/rules');

        $this->assertSame(RuleState::Denied, $this->proposed->fresh()?->state);
    }

    public function test_a_rule_settled_meanwhile_is_refused_as_a_review_error(): void
    {
        $this->actingAs($this->owner)->from('/rules')
            ->patch("/rules/{$this->active->id}/approve")
            ->assertRedirect('/rules')
            ->assertSessionHasErrors(['review' => 'This rule is active already, so it cannot be approved or denied.']);
    }

    public function test_a_missing_rule_and_a_malformed_id_are_not_found(): void
    {
        foreach (['999999', 'abc', '0', '9223372036854775808'] as $id) {
            $this->actingAs($this->owner)->patch("/rules/{$id}/approve")->assertNotFound();
        }

        $this->assertSame(RuleState::Proposed, $this->proposed->fresh()?->state);
    }
}
