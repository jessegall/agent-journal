<?php

declare(strict_types=1);

namespace Tests\Routes\Connections;

use App\Projects\Commands\RevokeProjectBinding\RevokeProjectBindingCommand;
use App\Projects\Values\BindingOutcome;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner disconnects one connected folder.
 */
#[TestsRoute('DELETE', 'connections.bindings.revoke')]
final class BindingsRevokeDeleteTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $bindingId = strtolower((string) Str::ulid());

        return RouteCall::as(Caller::User)
            ->parameters([
                'binding' => $bindingId,
            ])
            ->reply(
                RevokeProjectBindingCommand::class,
                new BindingOutcome($bindingId, 'revoked', '2026-11-26T10:00:00+00:00'),
            )
            ->expects(RevokeProjectBindingCommand::class, [
                'bindingId' => $bindingId,
            ]);
    }
}
