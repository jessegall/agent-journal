<?php

declare(strict_types=1);

namespace Tests\Routes\Connections;

use App\Commands\Projects\StartProjectCommandRun\StartProjectCommandRunCommand;
use App\Enums\Connections\CommandRunStatus;
use App\Enums\Projects\ArrangementType;
use App\Models\Projects\Environment;
use App\Models\Projects\Host;
use App\Models\Projects\ProjectBinding;
use App\Values\BindingFolder;
use App\Values\CommandRunStart;
use App\Values\PresenceReport;
use Domain\Comments\CommentsDomain;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\TestProjects;

/**
 * A main agent runs a journal command on its binding again: the run it finished before is answered.
 */
#[TestsRoute('POST', 'connections.commands.run')]
final class CommandsRunPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(CommentsDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        [$start, $binding] = $this->connectedStart($journal);

        return RouteCall::as(Caller::Agent, $start)
            ->payload([
                'request_key' => 'run-1',
                'binding' => $binding->id,
                'argv' => [
                    'comment',
                    'list',
                ],
                'stdin' => '',
            ])
            ->reply(StartProjectCommandRunCommand::class, new CommandRunStart(false, CommandRunStatus::Completed, []))
            ->expects(StartProjectCommandRunCommand::class, [
                'requestKey' => 'run-1',
                'agentId' => $start->agent->id,
                'bindingId' => $binding->id,
                'argv' => [
                    'comment',
                    'list',
                ],
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
