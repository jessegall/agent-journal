<?php

declare(strict_types=1);

namespace Tests\Feature\Rules;

use App\Core\Actors\ActorContext;
use App\Core\Actors\Exceptions\UserActorRequired;
use App\Core\Contracts\CurrentActorSetter;
use App\Domain\Rules\Actions\ProposeRule;
use App\Domain\Rules\Actions\RemoveRule;
use App\Domain\Rules\Actions\ReviewRule;
use App\Domain\Rules\ActiveRules;
use App\Domain\Rules\Api\Events\RuleApproved;
use App\Domain\Rules\Api\Events\RuleDenied;
use App\Domain\Rules\Api\Events\RuleRemoved;
use App\Domain\Rules\Api\RuleState;
use App\Domain\Rules\Exceptions\RuleNotProposed;
use App\Domain\Rules\Models\Rule;
use Illuminate\Support\Facades\Event;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

final class ReviewRuleTest extends TestCase
{
    use RefreshHookDatabase;

    private Rule $proposed;

    protected function setUp(): void
    {
        parent::setUp();

        Event::fake([RuleApproved::class, RuleDenied::class, RuleRemoved::class]);
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser(7));
        $this->proposed = $this->app->make(ProposeRule::class)->propose('No phase waits on the user.');
    }

    public function test_a_proposed_rule_does_not_hold_until_approved_once(): void
    {
        $this->assertSame([], $this->app->make(ActiveRules::class)->reminders());

        $this->app->make(ReviewRule::class)->approve($this->proposed->id);

        $this->assertSame(["Rule {$this->proposed->id}: No phase waits on the user."], $this->app->make(ActiveRules::class)->reminders());
        Event::assertDispatched(RuleApproved::class, fn (RuleApproved $event) => $event->ruleId === $this->proposed->id);
    }

    public function test_a_second_review_is_refused_and_changes_nothing(): void
    {
        $this->app->make(ReviewRule::class)->deny($this->proposed->id);

        try {
            $this->app->make(ReviewRule::class)->approve($this->proposed->id);
            $this->fail('A denied rule was approved.');
        } catch (RuleNotProposed) {
            $this->assertSame(RuleState::Denied, $this->proposed->fresh()?->state);
            Event::assertNotDispatched(RuleApproved::class);
            Event::assertDispatchedTimes(RuleDenied::class, 1);
        }
    }

    public function test_only_a_user_reviews_a_rule(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forAgent(3));

        $this->expectException(UserActorRequired::class);

        $this->app->make(ReviewRule::class)->approve($this->proposed->id);
    }

    public function test_removing_a_rule_raises_its_fact(): void
    {
        $this->app->make(ReviewRule::class)->approve($this->proposed->id);

        $this->app->make(RemoveRule::class)->remove($this->proposed->fresh() ?? $this->proposed);

        $this->assertSame(RuleState::Removed, $this->proposed->fresh()?->state);
        Event::assertDispatched(RuleRemoved::class, fn (RuleRemoved $event) => $event->ruleId === $this->proposed->id);
    }
}
