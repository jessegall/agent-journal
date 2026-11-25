<?php

declare(strict_types=1);

namespace Domain\Rules\Tests\Commands;

use App\Contracts\Bus\CommandBus;
use App\Events\Web\PageChanged;
use App\Exceptions\CommandAdmissionRefused;
use App\Support\Access\AccessSettings;
use Domain\Rules\Commands\RemoveRule\RemoveRuleCommand;
use Domain\Rules\Enums\RuleStatus;
use Domain\Rules\Events\RuleRemoved;
use Domain\Rules\Exceptions\RuleMissing;
use Domain\Rules\Models\Rule;
use Domain\Rules\Tests\Fixtures\RuleFixtures;
use Domain\Rules\Tests\TestCase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\HoldingRules;

/**
 * The user removes a rule that holds, which then no longer does; an agent may not remove one, and a rule that is not
 * there is refused by name.
 */
final class RemoveRuleTest extends TestCase
{
    use CommitsHookRows;

    private Rule $active;

    private const array TABLES = [
        'rules',
        'users',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        Event::fake([RuleRemoved::class]);
        $this->journal->agent('Planner')->owner();
        $this->active = $this->journal->fixtures(RuleFixtures::class)
            ->holdingRule('Held', 'Held rule.', proposer: 'Planner', approver: 'Owner')
            ->ruleCalled('Held');
    }

    public function test_a_removed_rule_no_longer_holds_and_says_so(): void
    {
        $this->journal->run(new RemoveRuleCommand($this->active->id));

        $this->assertSame(RuleStatus::Removed, $this->active->refresh()->status);
        Event::assertDispatched(RuleRemoved::class, fn (RuleRemoved $event) => $event->ruleId === $this->active->id);
    }

    public function test_an_agent_may_not_remove_a_rule_and_it_still_holds(): void
    {
        $this->journal->actAs('Planner');

        $this->assertThrows(
            fn () => $this->journal->run(new RemoveRuleCommand($this->active->id)),
            CommandAdmissionRefused::class,
        );
        $this->assertSame(RuleStatus::Active, $this->active->refresh()->status);
    }

    public function test_a_rule_that_is_not_there_is_refused_by_name(): void
    {
        $missingId = (string) Str::ulid();

        $this->assertThrows(
            fn () => $this->journal->run(new RemoveRuleCommand($missingId)),
            RuleMissing::class,
            RuleMissing::withId($missingId)->getMessage(),
        );
    }

    public function test_a_removed_rule_changes_the_page_too(): void
    {
        Event::fake([PageChanged::class]);

        $this->app->make(CommandBus::class)->run(new RemoveRuleCommand(HoldingRules::create('Old rule.')->id));

        Event::assertDispatchedTimes(PageChanged::class, 1);
    }

    public function test_with_no_owner_nobody_is_told(): void
    {
        Event::fake([PageChanged::class]);

        $this->app->instance(AccessSettings::class, new AccessSettings(null));

        $this->app->make(CommandBus::class)->run(new RemoveRuleCommand(HoldingRules::create('Old rule.')->id));

        Event::assertNotDispatched(PageChanged::class);
    }
}
