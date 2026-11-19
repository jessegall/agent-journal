<?php

declare(strict_types=1);

namespace Domain\Rules\Tests\Feature;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Bus\Contracts\CommandBus;
use Domain\Rules\Api\Events\RuleApproved;
use Domain\Rules\Api\Events\RuleDenied;
use Domain\Rules\Commands\ApproveRule;
use Domain\Rules\Commands\DenyRule;
use Domain\Rules\Enums\RuleState;
use Domain\Rules\Exceptions\RuleNotProposed;
use Domain\Rules\Models\Rule;
use Domain\Rules\Support\ActiveRules;
use Domain\Rules\Tests\TestCase;
use Illuminate\Support\Facades\Event;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;

/**
 * The user reviews a proposed rule through the ApproveRule and DenyRule commands: once, and only while it is proposed.
 */
final class ReviewRuleTest extends TestCase
{
    use CommitsHookRows;

    /**
     * The bus commits the Rules commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = ['rules'];

    private Rule $proposed;

    protected function setUp(): void
    {
        parent::setUp();

        Event::fake([RuleApproved::class, RuleDenied::class]);
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(7)),
            new OwnerAuthority('test'),
        );
        $this->proposed = Rule::proposed(
            'No phase waits on the user.',
            'Agents keep forgetting it.',
            null,
            ActorContext::forAgent(TestIds::of(70)),
        );
    }

    public function test_a_proposed_rule_does_not_hold_until_approved_once(): void
    {
        $this->assertSame([], $this->app->make(ActiveRules::class)->reminders());

        $this->app->make(CommandBus::class)->run(new ApproveRule($this->proposed->id));

        $this->assertSame(
            ["Rule {$this->proposed->id}: No phase waits on the user."],
            $this->app->make(ActiveRules::class)->reminders(),
        );
        Event::assertDispatched(
            RuleApproved::class,
            fn (RuleApproved $event) => $event->ruleId === $this->proposed->id,
        );
    }

    public function test_a_second_review_is_refused_and_changes_nothing(): void
    {
        $bus = $this->app->make(CommandBus::class);
        $bus->run(new DenyRule($this->proposed->id));

        try {
            $bus->run(new ApproveRule($this->proposed->id));
            $this->fail('A denied rule was approved.');
        } catch (RuleNotProposed) {
            $this->assertSame(RuleState::Denied, $this->proposed->fresh()?->state);
            Event::assertNotDispatched(RuleApproved::class);
            Event::assertDispatchedTimes(RuleDenied::class, 1);
        }
    }
}
