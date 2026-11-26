<?php

declare(strict_types=1);

namespace Tests\Routes\Connections;

use App\Projects\Commands\IssueProjectInvitation\IssueProjectInvitationCommand;
use App\Projects\Values\IssuedInvitation;
use Illuminate\Support\Str;
use Tests\Support\Connections\ConnectsProjects;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner issues an install line for a new project.
 */
#[TestsRoute('POST', 'connections.invitations.issue')]
final class InvitationsIssuePostTest extends GuardedRouteEntryTestCase
{
    use ConnectsProjects;

    protected function arrange(TestJournal $journal): RouteCall
    {
        return RouteCall::as(Caller::User)
            ->payload([
                'issuanceKey' => 'issue-1',
            ])
            ->reply(IssueProjectInvitationCommand::class, new IssuedInvitation(
                strtolower((string) Str::ulid()),
                '2026-11-26T11:00:00+00:00',
                'IA-1',
                1,
            ))
            ->expects(IssueProjectInvitationCommand::class, [
                'issuanceKey' => 'issue-1',
                'projectId' => null,
                'environmentId' => null,
            ]);
    }
}
