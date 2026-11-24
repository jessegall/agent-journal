<?php

declare(strict_types=1);

namespace Domain\Rules\Tests\Feature\Http;

use App\Contracts\Bus\CommandBus;
use App\Events\Web\PageChanged;
use App\Support\ActorContext;
use App\Support\UserChannel;
use Domain\Access\Support\AccessSettings;
use Domain\Rules\Commands\ApproveRule\ApproveRuleCommand;
use Domain\Rules\Commands\RemoveRule\RemoveRuleCommand;
use Domain\Rules\Models\Rule;
use Domain\Rules\Tests\TestCase;
use Illuminate\Support\Facades\Event;
use Tests\Support\CommitsHookRows;
use Tests\Support\HoldingRules;
use Tests\Support\TestIds;
use Tests\Support\WatchesPageChanges;

/**
 * A RulesPageTest command that changes what the owner sees tells the owner's page once, through the bus that commits
 * it.
 */
final class RulePageChangeTest extends TestCase
{
    use CommitsHookRows;
    use WatchesPageChanges;

    /**
     * The bus commits the RulesPageTest commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = ['rules', 'users'];

    public function test_an_approved_rule_tells_the_owner_once_on_their_private_channel(): void
    {
        $rule = Rule::create(
            'Every phase ends with its tests.',
            'Agents keep forgetting it.',
            null,
            ActorContext::forUser(TestIds::of(7)),
        );

        $this->app->make(CommandBus::class)->run(new ApproveRuleCommand($rule->id));

        Event::assertDispatchedTimes(PageChanged::class, 1);

        Event::assertDispatched(PageChanged::class, fn (PageChanged $change) => $change->userIds === [$this->owner->id]
            && $change->broadcastOn()[0]->name === 'private-'.UserChannel::nameFor($this->owner->id)
            && $change->broadcastWith() === []);
    }

    public function test_a_removed_rule_changes_the_page_too(): void
    {
        $this->app->make(CommandBus::class)->run(new RemoveRuleCommand(HoldingRules::create('Old rule.')->id));

        Event::assertDispatchedTimes(PageChanged::class, 1);
    }

    public function test_with_no_owner_nobody_is_told(): void
    {
        $this->app->instance(AccessSettings::class, new AccessSettings(null));

        $this->app->make(CommandBus::class)->run(new RemoveRuleCommand(HoldingRules::create('Old rule.')->id));

        Event::assertNotDispatched(PageChanged::class);
    }
}
