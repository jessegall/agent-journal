<?php

declare(strict_types=1);

namespace Domain\Rules\Tests\Commands;

use App\Exceptions\CommandAdmissionRefused;
use Domain\Rules\Commands\RemoveRule\RemoveRuleCommand;
use Domain\Rules\Enums\RuleStatus;
use Domain\Rules\Events\RuleRemoved;
use Domain\Rules\Exceptions\RuleMissing;
use Domain\Rules\Models\Rule;
use Domain\Rules\Tests\TestCase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Tests\Support\HoldingRules;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Seeding\SeedsJournal;

/**
 * The user removes a rule that holds, which then no longer does; an agent may not remove one, and a rule that is not
 * there is refused by name.
 */
final class RemoveRuleTest extends TestCase
{
    use RefreshHookDatabase;
    use SeedsJournal;

    private Rule $active;

    protected function setUp(): void
    {
        parent::setUp();

        Event::fake([RuleRemoved::class]);
        $this->journal()->agent('Planner')->owner();
        $this->active = HoldingRules::create('Held rule.');
    }

    public function test_a_removed_rule_no_longer_holds_and_says_so(): void
    {
        $this->journal()->run(new RemoveRuleCommand($this->active->id));

        $this->assertSame(RuleStatus::Removed, $this->active->refresh()->status);
        Event::assertDispatched(RuleRemoved::class, fn (RuleRemoved $event) => $event->ruleId === $this->active->id);
    }

    public function test_an_agent_may_not_remove_a_rule_and_it_still_holds(): void
    {
        $this->journal()->actAs('Planner');

        $this->assertThrows(fn () => $this->journal()->run(new RemoveRuleCommand($this->active->id)), CommandAdmissionRefused::class);
        $this->assertSame(RuleStatus::Active, $this->active->refresh()->status);
    }

    public function test_a_rule_that_is_not_there_is_refused_by_name(): void
    {
        $missingId = (string) Str::ulid();

        $this->assertThrows(
            fn () => $this->journal()->run(new RemoveRuleCommand($missingId)),
            RuleMissing::class,
            RuleMissing::withId($missingId)->getMessage(),
        );
    }
}
