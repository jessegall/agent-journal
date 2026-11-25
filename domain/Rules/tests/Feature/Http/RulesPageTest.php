<?php

declare(strict_types=1);

namespace Domain\Rules\Tests\Feature\Http;

use App\Models\Access\User;
use App\Support\ActorContext;
use Domain\Rules\Enums\RuleStatus;
use Domain\Rules\Models\Rule;
use Domain\Rules\Tests\Fixtures\RuleFixtures;
use Domain\Rules\Tests\TestCase;
use Tests\Support\CommitsHookRows;
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
    private const array TABLES = [
        'rules',
        'users',
    ];

    private User $owner;

    private Rule $proposed;

    private Rule $active;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = $this->journal->user('Proposer')->owner()->ownerUser();
        $this->active = $this->journal->fixtures(RuleFixtures::class)
            ->holdingRule('Plain', 'Write all code in plain English.', proposer: 'Proposer', approver: 'Owner')
            ->ruleCalled('Plain');

        $this->proposed = Rule::create(
            "Every phase ends with its tests.\n  - run them once",
            'Agents keep forgetting it.',
            null,
            ActorContext::forUser(TestIds::of(7)),
        );
    }

    public function test_approving_returns_to_the_page_it_came_from(): void
    {
        $this->actingAs($this->owner)->from("/rules?q=phase&rule={$this->proposed->id}")
            ->patch("/rules/{$this->proposed->number}/approve")
            ->assertStatus(303)
            ->assertRedirect("/rules?q=phase&rule={$this->proposed->id}");

        $this->assertSame(RuleStatus::Active, $this->proposed->fresh()?->status);
    }

    public function test_approving_from_home_returns_to_home_with_every_windows_query(): void
    {
        $this->actingAs($this->owner)->from("/?q=release&rules_q=phase&rule={$this->proposed->id}")
            ->patch("/rules/{$this->proposed->number}/approve")
            ->assertStatus(303)
            ->assertRedirect("/?q=release&rules_q=phase&rule={$this->proposed->id}");

        $this->assertSame(RuleStatus::Active, $this->proposed->fresh()?->status);
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
        foreach ([
            TestIds::of(999999),
            'abc',
            '0',
            '9223372036854775808',
        ] as $id) {
            $this->actingAs($this->owner)->patch("/rules/{$id}/approve")->assertNotFound();
        }

        $this->assertSame(RuleStatus::Proposed, $this->proposed->fresh()?->status);
    }
}
