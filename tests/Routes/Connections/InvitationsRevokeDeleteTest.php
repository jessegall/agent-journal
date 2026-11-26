<?php

declare(strict_types=1);

namespace Tests\Routes\Connections;

use App\Commands\Projects\RevokeProjectInvitation\RevokeProjectInvitationCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner revokes an install line before it is used.
 */
#[TestsRoute('DELETE', 'connections.invitations.revoke')]
final class InvitationsRevokeDeleteTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $invitationId = strtolower((string) Str::ulid());

        return RouteCall::as(Caller::User)
            ->parameters([
                'invitation' => $invitationId,
            ])
            ->expects(RevokeProjectInvitationCommand::class, [
                'invitationId' => $invitationId,
                'seenVersion' => null,
            ]);
    }
}
