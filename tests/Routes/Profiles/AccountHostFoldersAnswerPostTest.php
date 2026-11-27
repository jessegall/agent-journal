<?php

declare(strict_types=1);

namespace Tests\Routes\Profiles;

use App\Hosts\Commands\ReadHostFolderAnswer\ReadHostFolderAnswerCommand;
use App\Hosts\Enums\HostInstructionStatus;
use App\Values\HostFolderAnswer;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host's sign-in runner reads where its folder instruction stands.
 */
#[TestsRoute('POST', 'profiles.account-host.folders.answer')]
final class AccountHostFoldersAnswerPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();

        return RouteCall::as(Caller::SharedHost, $host)
            ->parameters(['instruction' => 'instruction-1'])
            ->reply(ReadHostFolderAnswerCommand::class, new HostFolderAnswer(HostInstructionStatus::Done, '', false))
            ->answers(['status' => 'done', 'reason' => '', 'is_bound' => false])
            ->expects(ReadHostFolderAnswerCommand::class, ['hostId' => $host->hostId, 'instructionId' => 'instruction-1']);
    }
}
