<?php

declare(strict_types=1);

namespace Domain\Rules\Tests\Feature\Http;

use App\Support\ActorContext;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Rules\Enums\RuleState;
use Domain\Rules\Models\Rule;
use Domain\Rules\Tests\TestCase;
use Inertia\Testing\AssertableInertia;
use Tests\Support\CommitsHookRows;
use Tests\Support\HoldingRules;
use Tests\Support\TestIds;

/**
 * The rules page: the list and reader on one page, and approving or denying the proposed rule it shows.
 */
final class RulesPageTest extends TestCase
{
    use CommitsHookRows;

    /**
     * The bus commits the RulesPageTest commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = ['rules', 'users'];

    private User $owner;

    private Rule $proposed;

    private Rule $active;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->active = HoldingRules::create('Write all code in plain English.');

        $this->proposed = Rule::create(
            "Every phase ends with its tests.\n  - run them once",
            'Agents keep forgetting it.',
            null,
            ActorContext::forUser(TestIds::of(7)),
        );
    }

    public function test_a_guest_is_sent_to_sign_in(): void
    {
        $this->get('/rules')->assertRedirect('/login');
    }

    public function test_the_list_and_the_selected_rule_share_one_page(): void
    {
        $this->actingAs($this->owner)->get(
            "/rules?q=phase&rule={$this->proposed->id}",
        )->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->component('layout/DeclaredLayout')
            ->where('page.state', 'ready')
            ->where('page.data.root.children.0.children.0.text', 'Rules (1)')
            ->where(
                'page.data.root.children.0.children.1.field',
                ['name' => 'q', 'value' => 'phase', 'clears' => ['page', 'rule'], 'options' => []],
            )
            ->where('page.data.root.children.1.children.0.children.0.rows.0.key', (string) $this->proposed->id)
            ->where('page.data.root.children.1.children.0.children.0.rows.0.isCurrent', true)
            ->where(
                'page.data.root.children.1.children.0.children.0.rows.0.query',
                ['rule' => (string) $this->proposed->id],
            )
            ->where('page.data.root.children.1.children.1.children.0.children.1.text', 'Proposed')
            ->where(
                'page.data.root.children.1.children.1.children.1.text',
                "Every phase ends with its tests.\n  - run them once",
            )
            ->where(
                'page.data.root.children.1.children.1.children.2.children.1.form.href',
                "/rules/{$this->proposed->number}/approve",
            )
            ->where('page.data.root.children.1.children.1.children.2.children.1.form.method', 'PATCH'));
    }

    public function test_an_unknown_rule_is_missing_without_text(): void
    {
        $this->actingAs($this->owner)->get(
            '/rules?rule='.TestIds::of(999999),
        )->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.root.children.1.children.1.tag', 'notice')
            ->where('page.data.root.children.1.children.1.text', 'This rule does not exist.'));
    }

    public function test_approving_returns_to_the_page_it_came_from(): void
    {
        $this->actingAs($this->owner)->from("/rules?q=phase&rule={$this->proposed->id}")
            ->patch("/rules/{$this->proposed->number}/approve")
            ->assertStatus(303)
            ->assertRedirect("/rules?q=phase&rule={$this->proposed->id}");

        $this->assertSame(RuleState::Active, $this->proposed->fresh()?->state);
    }

    public function test_approving_from_home_returns_to_home_with_every_windows_query(): void
    {
        $this->actingAs($this->owner)->from("/?q=release&rules_q=phase&rule={$this->proposed->id}")
            ->patch("/rules/{$this->proposed->number}/approve")
            ->assertStatus(303)
            ->assertRedirect("/?q=release&rules_q=phase&rule={$this->proposed->id}");

        $this->assertSame(RuleState::Active, $this->proposed->fresh()?->state);
    }

    public function test_denying_settles_the_rule(): void
    {
        $this->actingAs($this->owner)->from('/rules')->patch(
            "/rules/{$this->proposed->number}/deny",
        )->assertRedirect('/rules');

        $this->assertSame(RuleState::Denied, $this->proposed->fresh()?->state);
    }

    public function test_a_rule_settled_meanwhile_is_refused_as_a_review_error(): void
    {
        $this->actingAs($this->owner)->from('/rules')
            ->patch("/rules/{$this->active->number}/approve")
            ->assertRedirect('/rules')
            ->assertSessionHasErrors(['review' => 'This rule is active already, so it cannot be approved or denied.']);
    }

    public function test_a_missing_rule_and_a_malformed_id_are_not_found(): void
    {
        foreach ([TestIds::of(999999), 'abc', '0', '9223372036854775808'] as $id) {
            $this->actingAs($this->owner)->patch("/rules/{$id}/approve")->assertNotFound();
        }

        $this->assertSame(RuleState::Proposed, $this->proposed->fresh()?->state);
    }
}
