<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Routes;

use App\Web\Creation\PageFactory;
use App\Web\Creation\WindowFactory;
use Domain\Tasks\Data\TasksPaneData;
use Domain\Tasks\Http\Pages\TasksPageBuilder;
use Domain\Tasks\Http\Pages\TasksPageData;
use Domain\Tasks\Http\Windows\TasksWindowBuilder;
use Domain\Tasks\TasksDomain;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Illuminate\Http\Request;
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

    public function test_the_pane_builds_compact_rows_and_a_full_link(): void
    {
        $this->journal->owner();
        $this->journal->fixtures(TaskFixtures::class)->createTask('An example');
        $factory = new WindowFactory($this->app);
        $factory->register(TasksPaneData::class, TasksWindowBuilder::class);

        $pane = $factory->create(TasksPaneData::class, Request::create('/?q=example'));

        $this->assertCount(1, $pane->items);
        $this->assertSame('An example', $pane->items[0]->label);
        $this->assertSame('Open', $pane->items[0]->value);
        $this->assertSame('/tasks?q=example', $pane->fullUrl);
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
