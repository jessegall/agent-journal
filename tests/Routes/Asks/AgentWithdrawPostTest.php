<?php

declare(strict_types=1);

namespace Tests\Routes\Asks;

use App\Commands\Asks\AskSupervisor\AskSupervisorCommand;
use App\Commands\Asks\WithdrawAsk\WithdrawAskCommand;
use App\Support\ProfileProposal;
use App\Values\AskReference;
use Domain\Tasks\TasksDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent withdraws one of its own open asks.
 */
#[TestsRoute('POST', 'asks.agent.withdraw')]
final class AgentWithdrawPostTest extends GuardedRouteEntryTestCase
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

        return RouteCall::as(Caller::Agent, $start)
            ->payload([
                'request_key' => 'withdraw-1',
                'id' => $ask->id,
            ])
            ->reply(WithdrawAskCommand::class, $ask)
            ->expects(WithdrawAskCommand::class, [
                'ask' => new AskReference($ask->id),
            ]);
    }
}
