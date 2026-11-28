<?php

declare(strict_types=1);

namespace Tests\Routes\Web;

use App\Http\Pages\TerminalPageBuilder;
use App\Terminals\Data\TerminalWindowData;
use App\Web\Creation\PageFactory;
use Illuminate\Http\Request;
use Illuminate\Routing\Route;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\Terminals\TakesTerminalControl;

/**
 * The owner opens an agent's terminal window.
 */
#[TestsRoute('GET', 'web.terminal')]
final class TerminalGetTest extends GuardedRouteEntryTestCase
{
    use OpensTerminalRuntimes;
    use TakesTerminalControl;

    public function test_the_builder_uses_the_effective_route_on_its_visit(): void
    {
        $factory = new PageFactory($this->app);
        $factory->register(TerminalWindowData::class, TerminalPageBuilder::class);
        $visit = Request::create('/web/terminal/target?agent=ignored');
        $route = new Route('GET', '/web/terminal/{agent}', []);
        $route->bind($visit);
        $visit->setRouteResolver(static fn () => $route);

        $this->assertSame('target', $factory->create(TerminalWindowData::class, $visit)->agentId);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();

        return RouteCall::as(Caller::User)->parameters([
            'agent' => $this->controllableRuntime()->session->agent_id,
        ]);
    }
}
