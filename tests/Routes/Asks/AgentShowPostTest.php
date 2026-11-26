<?php

declare(strict_types=1);

namespace Tests\Routes\Asks;

use App\Commands\Asks\AskSupervisor\AskSupervisorCommand;
use App\Support\ProfileProposal;
use Domain\Tasks\TasksDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent reads one of its own asks: nothing is sent on.
 */
#[TestsRoute('POST', 'asks.agent.show')]
final class AgentShowPostTest extends GuardedRouteEntryTestCase
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
        $ask = $journal->runAs('Requester', new AskSupervisorCommand('Which input?', 'first'));

        return RouteCall::as(Caller::Agent, $start)->payload([
            'id' => $ask->id,
        ]);
    }
}
