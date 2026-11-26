<?php

declare(strict_types=1);

namespace Tests\Routes\Connections;

use App\Enums\Projects\ArrangementType;
use App\Models\Projects\Environment;
use App\Models\Projects\Host;
use App\Models\Projects\ProjectBinding;
use App\Values\BindingFolder;
use App\Values\PresenceReport;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\TestProjects;

/**
 * A main agent reads how a project command it asked for on its binding stands: nothing is sent on.
 */
#[TestsRoute('POST', 'connections.commands.status')]
final class CommandsStatusPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        [$start, $binding] = $this->connectedStart($journal);

        return RouteCall::as(Caller::Agent, $start)->payload([
            'binding' => $binding->id,
            'request_key' => 'run-1',
        ]);
    }

    /**
     * An agent that is the main agent of a binding on a reconciled relay with its environment assigned.
     *
     * @return array{TestStart, ProjectBinding}
     */
    private function connectedStart(TestJournal $journal): array
    {
        $start = $journal->owner()->signedStart('Main');
        $host = Host::create('laptop', 'secret-'.bin2hex(random_bytes(4)), [], ArrangementType::Local);
        $project = TestProjects::local();
        $binding = ProjectBinding::create(
            $host,
            $project,
            Environment::create($project, 'Shop'),
            $start->agent,
            new BindingFolder(
                'root-'.bin2hex(random_bytes(4)),
                '/Users/owner/shop',
                'Owner laptop',
                bin2hex(random_bytes(8)),
            ),
        );
        $binding->recordPresence(new PresenceReport(
            'boot-1',
            1,
            '1.0.0',
            true,
            false,
            0,
            [],
            true,
        ));

        return [
            $start,
            $binding,
        ];
    }
}
