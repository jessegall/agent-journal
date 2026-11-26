<?php

declare(strict_types=1);

namespace Tests\Routes\Asks;

use App\Asks\Commands\AskSupervisor\AskSupervisorCommand;
use App\Asks\Commands\ReplyToAsk\ReplyToAskCommand;
use App\Profiles\ProfileProposal;
use App\Values\AskReference;
use Domain\Tasks\TasksDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The supervisor answers an ask made of them.
 */
#[TestsRoute('POST', 'asks.agent.reply')]
final class AgentReplyPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner()
            ->activatedProfile(ProfileProposal::fromConfiguration((array) config('profiles')))
            ->agent('Requester', 'journal-worker');
        $start = $journal->signedStart('Supervisor', 'journal-code-reviewer');
        $ask = $journal->runAs('Requester', new AskSupervisorCommand('Which input?', 'first'));

        return RouteCall::as(Caller::Agent, $start)
            ->payload([
                'request_key' => 'reply-1',
                'id' => $ask->id,
                'body' => 'Check the input file.',
            ])
            ->reply(ReplyToAskCommand::class, $ask)
            ->expects(ReplyToAskCommand::class, [
                'ask' => new AskReference($ask->id),
                'body' => 'Check the input file.',
            ]);
    }
}
