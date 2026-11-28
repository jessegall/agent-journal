<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Routes;

use App\Web\Creation\PageFactory;
use App\Web\Creation\WindowFactory;
use Domain\Plans\Data\PlansPaneData;
use Domain\Plans\Http\Pages\PlansPageBuilder;
use Domain\Plans\Http\Pages\PlansPageData;
use Domain\Plans\Http\Windows\PlansWindowBuilder;
use Domain\Plans\PlansDomain;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Illuminate\Http\Request;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner opens the list of plans.
 */
#[TestsRoute('GET', 'plans.list')]
final class ListGetTest extends GuardedRouteEntryTestCase
{
    public function test_the_index_builds_its_exact_layout_product(): void
    {
        $this->journal->owner();
        $factory = new PageFactory($this->app);
        $factory->register(PlansPageData::class, PlansPageBuilder::class);
        $result = $factory->create(PlansPageData::class, Request::create('/plans'));

        $this->assertSame('Plans', $result->layout()->root->children[0]->children[0]->text);
    }

    public function test_the_pane_exposes_only_the_compact_rows_and_full_link(): void
    {
        $this->journal->owner();
        $title = 'An example';
        $this->journal->fixtures(PlanFixtures::class)->createPlan($title);
        $factory = new WindowFactory($this->app);
        $factory->register(PlansPaneData::class, PlansWindowBuilder::class);

        $pane = $factory->create(PlansPaneData::class, Request::create('/?q=example'));

        $this->assertCount(1, $pane->items);
        $this->assertSame($title, $pane->items[0]->label);
        $this->assertSame('Planned', $pane->items[0]->value);
        $this->assertSame('/plans?q=example', $pane->fullUrl);
    }

    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();

        return RouteCall::as(Caller::User);
    }
}
