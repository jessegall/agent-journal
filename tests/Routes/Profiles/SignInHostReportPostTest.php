<?php

declare(strict_types=1);

namespace Tests\Routes\Profiles;

use App\Accounts\Commands\NotifySignIn\NotifySignInCommand;
use App\Accounts\Enums\SignInOutcome;
use App\Values\SignInIdentity;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host reports how a sign-in ended and who it signed in.
 */
#[TestsRoute('POST', 'profiles.sign-in-host.report')]
final class SignInHostReportPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();
        $attemptId = (string) Str::ulid();

        return RouteCall::as(Caller::SharedHost, $host)
            ->parameters([
                'attempt' => $attemptId,
            ])
            ->payload([
                'outcome' => 'verified',
                'generation' => 1,
                'display' => 'Writer',
            ])
            ->expects(NotifySignInCommand::class, [
                'hostId' => $host->hostId,
                'attemptId' => $attemptId,
                'generation' => 1,
                'outcome' => SignInOutcome::Verified,
                'identity' => new SignInIdentity('Writer', null, null),
                'refusal' => null,
            ]);
    }
}
