<?php

declare(strict_types=1);

namespace Tests\Routes\Accounts;

use App\Commands\Accounts\BeginSignIn\BeginSignInCommand;
use App\Enums\Accounts\SignInMethod;
use App\Values\SignInStarted;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner starts signing a new account in, with the driver and method they chose.
 */
#[TestsRoute('POST', 'accounts.start-sign-in')]
final class StartSignInPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner()->user('Member');

        return RouteCall::recorded('account-sign-in', [])
            ->reply(BeginSignInCommand::class, new SignInStarted(strtolower((string) Str::ulid()), false))
            ->expects(BeginSignInCommand::class, [
                'driver' => 'claude-code',
                'method' => SignInMethod::OAuth,
            ])
            ->hiddenFrom('Member');
    }
}
