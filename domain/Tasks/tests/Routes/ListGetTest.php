<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Routes;

use App\Web\Creation\PageFactory;
use Domain\Tasks\Http\Pages\TasksPageBuilder;
use Domain\Tasks\Http\Pages\TasksPageData;
use Illuminate\Http\Request;
use Domain\Tasks\TasksDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner opens the list of tasks.
 */
#[TestsRoute('GET', 'tasks.list')]
final class ListGetTest extends GuardedRouteEntryTestCase
{
    public function test_the_index_builds_its_exact_layout_product(): void
    {
        $this->journal->owner();
        $factory = new PageFactory($this->app);
        $factory->register(TasksPageData::class, TasksPageBuilder::class);
        $result = $factory->create(TasksPageData::class, Request::create('/tasks'));

        $this->assertSame('Tasks', $result->layout()->root->children[0]->children[0]->text);
    }

    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();

        return RouteCall::as(Caller::User);
    }
}
