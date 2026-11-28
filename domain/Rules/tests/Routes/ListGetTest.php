<?php

declare(strict_types=1);

namespace Domain\Rules\Tests\Routes;

use App\Web\Creation\PageFactory;
use App\Web\Creation\WindowFactory;
use Domain\Rules\Data\RulesPaneData;
use Domain\Rules\Http\Pages\RulesPageBuilder;
use Domain\Rules\Http\Pages\RulesPageData;
use Domain\Rules\Http\Windows\RulesWindowBuilder;
use Domain\Rules\RulesDomain;
use Illuminate\Http\Request;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner opens the list of rules.
 */
#[TestsRoute('GET', 'rules.list')]
final class ListGetTest extends GuardedRouteEntryTestCase
{
    public function test_the_rules_builder_returns_its_checked_layout(): void
    {
        $this->journal->owner();
        $factory = new PageFactory($this->app);
        $factory->register(RulesPageData::class, RulesPageBuilder::class);
        $result = $factory->create(RulesPageData::class, Request::create('/rules?q=example'));

        $this->assertSame('rules', $result->layout()->root->key);
    }

    public function test_the_pane_builds_compact_rows_and_a_full_link(): void
    {
        $this->journal->owner();
        $factory = new WindowFactory($this->app);
        $factory->register(RulesPaneData::class, RulesWindowBuilder::class);

        $pane = $factory->create(RulesPaneData::class, Request::create('/?q=example'));

        $this->assertSame([], $pane->items);
        $this->assertSame('/rules?q=example', $pane->fullUrl);
    }

    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(RulesDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();

        return RouteCall::as(Caller::User);
    }
}
