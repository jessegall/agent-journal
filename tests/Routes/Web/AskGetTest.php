<?php

declare(strict_types=1);

namespace Tests\Routes\Web;

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
 * The owner opens one ask an agent made.
 */
#[TestsRoute('GET', 'web.ask')]
final class AskGetTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner()
            ->activatedProfile(ProfileProposal::fromConfiguration((array) config('profiles')))
            ->idleAgent('Requester', 'journal-worker');
        $journal->idleAgent('Supervisor', 'journal-code-reviewer');
        $ask = $journal->runAs('Requester', new AskSupervisorCommand('Which input?', 'first'));

        return RouteCall::as(Caller::User)->parameters([
            'ask' => $ask->id,
        ]);
    }
}
