<?php

declare(strict_types=1);

namespace Tests\Routes\Web;

use App\Commands\Terminals\SubmitPrivateInput\SubmitPrivateInputCommand;
use App\Models\Drivers\TerminalGrant;
use App\Values\PrivateSubmission;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\Terminals\TakesTerminalControl;

/**
 * The holder of a terminal's control submits a private value; the command names only its submission.
 */
#[TestsRoute('POST', 'web.submit-private-input')]
final class SubmitPrivateInputPostTest extends GuardedRouteEntryTestCase
{
    use OpensTerminalRuntimes;
    use TakesTerminalControl;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $agentId = $this->grantedRuntime()->session->agent_id;
        $grant = TerminalGrant::query()->acrossActors()->sole();

        return RouteCall::recorded('terminal-control-submit-private', [
            '01JPAGEREQUESTAGENT0000000' => $agentId,
        ])
            ->reply(SubmitPrivateInputCommand::class, $grant->id)
            ->expects(SubmitPrivateInputCommand::class, [
                'agentId' => $agentId,
                'grantId' => self::GRANT,
                'submission' => new PrivateSubmission('submission-1', 6),
            ]);
    }
}
