<?php

declare(strict_types=1);

namespace Tests\Routes\Connections;

use App\Connections\Data\ProjectPaneData;
use App\Http\Windows\ProjectWindowBuilder;
use App\Projects\Enums\ProjectWindowStatus;
use App\Web\Creation\WindowFactory;
use Illuminate\Http\Request;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner opens the project window; a user the page is hidden from is refused.
 */
#[TestsRoute('GET', 'connections.project')]
final class ProjectGetTest extends GuardedRouteEntryTestCase
{
    public function test_the_compact_tree_links_to_the_full_project(): void
    {
        $this->journal->owner();
        $factory = new WindowFactory($this->app);
        $factory->register(ProjectPaneData::class, ProjectWindowBuilder::class);

        $pane = $factory->create(ProjectPaneData::class, Request::create('/'));

        $this->assertSame(ProjectWindowStatus::None, $pane->status);
        $this->assertSame([], $pane->items);
        $this->assertSame(route('connections.project', absolute: false), $pane->fullUrl);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner()->user('Member');

        return RouteCall::as(Caller::User)
            ->hiddenFrom('Member');
    }
}
