<?php

declare(strict_types=1);

namespace Domain\Rules\Tests\Feature\Http;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Bus\Contracts\CommandBus;
use App\Web\Events\PageChanged;
use App\Web\Support\UserChannel;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Rules\Commands\ApproveRule;
use Domain\Rules\Commands\RemoveRule;
use Domain\Rules\Models\Rule;
use Domain\Rules\Tests\TestCase;
use Illuminate\Support\Facades\Event;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;

/**
 * A RulesPageTest command that changes what the owner sees tells the owner's page once, through the bus that commits
 * it.
 */
final class RulePageChangeTest extends TestCase
{
    use CommitsHookRows;

    /**
     * The bus commits the RulesPageTest commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = ['rules', 'users'];

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser($this->owner->id),
            new OwnerAuthority('test'),
        );
        Event::fake([PageChanged::class]);
    }

    public function test_an_approved_rule_tells_the_owner_once_on_their_private_channel(): void
    {
        $rule = Rule::proposed(
            'Every phase ends with its tests.',
            'Agents keep forgetting it.',
            null,
            ActorContext::forUser(TestIds::of(7)),
        );

        $this->app->make(CommandBus::class)->run(new ApproveRule($rule->id));

        Event::assertDispatchedTimes(PageChanged::class, 1);
        Event::assertDispatched(PageChanged::class, fn (PageChanged $change) => $change->userIds === [$this->owner->id]
            && $change->broadcastOn()[0]->name === 'private-'.UserChannel::nameFor($this->owner->id)
            && $change->broadcastWith() === []);
    }

    public function test_a_removed_rule_changes_the_page_too(): void
    {
        $this->app->make(CommandBus::class)->run(new RemoveRule(Rule::holding('Old rule.')->id));

        Event::assertDispatchedTimes(PageChanged::class, 1);
    }

    public function test_with_no_owner_nobody_is_told(): void
    {
        $this->app->instance(AccessSettings::class, new AccessSettings(null));

        $this->app->make(CommandBus::class)->run(new RemoveRule(Rule::holding('Old rule.')->id));

        Event::assertNotDispatched(PageChanged::class);
    }
}
