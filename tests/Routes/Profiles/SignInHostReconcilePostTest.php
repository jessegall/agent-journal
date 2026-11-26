<?php

declare(strict_types=1);

namespace Tests\Routes\Profiles;

use App\Accounts\Commands\ReconcileSignIns\ReconcileSignInsCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host names the sign-ins it still runs, so the journal ends the others.
 */
#[TestsRoute('POST', 'profiles.sign-in-host.reconcile')]
final class SignInHostReconcilePostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();
        $attemptId = (string) Str::ulid();

        return RouteCall::as(Caller::SharedHost, $host)
            ->payload([
                'running' => [
                    $attemptId,
                ],
            ])
            ->reply(ReconcileSignInsCommand::class, 0)
            ->expects(ReconcileSignInsCommand::class, [
                'hostId' => $host->hostId,
                'runningAttemptIds' => [
                    $attemptId,
                ],
            ]);
    }
}
