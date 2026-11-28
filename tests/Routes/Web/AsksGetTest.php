<?php

declare(strict_types=1);

namespace Tests\Routes\Web;

use App\Asks\Data\AskInboxPaneData;
use App\Http\Windows\AskInboxWindowBuilder;
use App\Web\Creation\WindowFactory;
use Illuminate\Http\Request;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner opens the asks inbox.
 */
#[TestsRoute('GET', 'web.asks')]
final class AsksGetTest extends GuardedRouteEntryTestCase
{
    public function test_the_compact_inbox_exposes_only_previews_and_its_address(): void
    {
        $this->journal->owner();
        $factory = new WindowFactory($this->app);
        $factory->register(AskInboxPaneData::class, AskInboxWindowBuilder::class);

        $pane = $factory->create(AskInboxPaneData::class, Request::create('/'));

        $this->assertSame([], $pane->items);
        $this->assertSame(route('web.asks', absolute: false), $pane->inboxUrl);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();

        return RouteCall::as(Caller::User);
    }
}
