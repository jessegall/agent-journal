<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Routes;

use App\Web\Creation\PageFactory;
use Domain\Plans\Http\Pages\PlansPageBuilder;
use Domain\Plans\Http\Pages\PlansPageData;
use Illuminate\Http\Request;
use Domain\Plans\PlansDomain;
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
