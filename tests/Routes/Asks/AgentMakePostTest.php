<?php

declare(strict_types=1);

namespace Tests\Routes\Asks;

use App\Asks\Commands\AskSupervisor\AskSupervisorCommand;
use App\Profiles\ProfileProposal;
use Domain\Tasks\TasksDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent asks its supervisor a question, under the request key it sends.
 */
#[TestsRoute('POST', 'asks.agent.make')]
final class AgentMakePostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()
            ->activatedProfile(ProfileProposal::fromConfiguration((array) config('profiles')))
            ->signedStart('Requester', 'journal-worker');
        $journal->idleAgent('Supervisor', 'journal-code-reviewer');
        $ask = $journal->runAs('Requester', new AskSupervisorCommand('Which input?', 'asked-before'));

        return RouteCall::as(Caller::Agent, $start)
            ->payload([
                'request_key' => 'ask-1',
                'body' => 'Which input?',
            ])
            ->reply(AskSupervisorCommand::class, $ask)
            ->expects(AskSupervisorCommand::class, [
                'body' => 'Which input?',
                'submissionKey' => 'ask-1',
                'type' => null,
            ]);
    }
}
