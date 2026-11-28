<?php

declare(strict_types=1);

namespace Tests\Routes\Web;

use App\Agents\Activity\Data\ActivityPaneData;
use App\Http\Windows\ActivityWindowBuilder;
use App\Web\Creation\WindowFactory;
use Illuminate\Http\Request;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner opens the activity feed; a user the page is hidden from is refused.
 */
#[TestsRoute('GET', 'web.activity')]
final class ActivityGetTest extends GuardedRouteEntryTestCase
{
    public function test_the_activity_pane_links_to_the_full_feed(): void
    {
        $this->journal->owner();
        $factory = new WindowFactory($this->app);
        $factory->register(ActivityPaneData::class, ActivityWindowBuilder::class);

        $pane = $factory->create(ActivityPaneData::class, Request::create('/'));

        $this->assertCount(0, $pane->items);
        $this->assertSame(route('web.activity', absolute: false), $pane->fullUrl);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner()->user('Member');

        return RouteCall::as(Caller::User)->hiddenFrom('Member');
    }
}
