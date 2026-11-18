<?php

declare(strict_types=1);

namespace Tests\Feature\Rules;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Exceptions\UserActorRequired;
use App\Actors\Support\ActorContext;
use App\Bus\Contracts\CommandBus;
use Domain\Rules\Api\Events\RuleRemoved;
use Domain\Rules\Commands\ApproveRule;
use Domain\Rules\Commands\ProposeRule;
use Domain\Rules\Commands\RemoveRule;
use Domain\Rules\Enums\RuleState;
use Domain\Rules\Exceptions\RuleMissing;
use Domain\Rules\Models\Rule;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Route;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * The Rules commands on the bus (doc 19, phase 2): proposing answers the new rule's id, removing raises its fact,
 * only a user approves, and the refusals reach the caller as refusals.
 */
final class RuleCommandsTest extends TestCase
{
    use CommitsHookRows;

    /**
     * The bus commits the Rules commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = ['rules'];

    protected function setUp(): void
    {
        parent::setUp();

        Event::fake([RuleRemoved::class]);
    }

    public function test_proposing_answers_the_id_of_a_rule_that_does_not_hold_yet(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forAgent(3));

        $id = $this->app->make(CommandBus::class)->run(new ProposeRule('Every phase ends with its tests.'));

        $this->assertSame(RuleState::Proposed, Rule::query()->findOrFail($id)->state);
    }

    public function test_removing_a_rule_raises_its_fact(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser(7));
        $rule = Rule::query()->create(['text' => 'Old rule.']);

        $this->app->make(CommandBus::class)->run(new RemoveRule($rule->id));

        $this->assertSame(RuleState::Removed, $rule->fresh()?->state);
        Event::assertDispatched(RuleRemoved::class, fn (RuleRemoved $event) => $event->ruleId === $rule->id);
    }

    public function test_a_main_agent_may_not_approve_a_rule_and_it_stays_proposed(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forAgent(3));
        $rule = Rule::proposed('No phase waits on the user.');

        try {
            $this->app->make(CommandBus::class)->run(new ApproveRule($rule->id));
            $this->fail('An agent approved a rule.');
        } catch (UserActorRequired) {
            $this->assertSame(RuleState::Proposed, $rule->fresh()?->state);
        }
    }

    public function test_an_agent_asking_to_approve_is_answered_403(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forAgent(3));
        $rule = Rule::proposed('No phase waits on the user.');
        Route::post('/rules-test/approve', fn (CommandBus $commands) => $commands->run(new ApproveRule($rule->id)));

        $this->postJson('/rules-test/approve')->assertForbidden();
    }

    public function test_a_missing_rule_is_refused_by_name(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser(7));

        $this->expectExceptionObject(RuleMissing::withId(999999));

        $this->app->make(CommandBus::class)->run(new RemoveRule(999999));
    }
}
