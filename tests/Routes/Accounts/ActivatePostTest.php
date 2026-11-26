<?php

declare(strict_types=1);

namespace Tests\Routes\Accounts;

use App\Commands\Accounts\SwitchAccount\SwitchAccountCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner makes one of their accounts the one agents sign in with.
 */
#[TestsRoute('POST', 'accounts.activate')]
final class ActivatePostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner()->user('Member');
        $accountId = strtolower((string) Str::ulid());

        return RouteCall::recorded('account-activate', [
            '01JPAGEREQUESTACCOUNT00000' => $accountId,
        ])
            ->expects(SwitchAccountCommand::class, [
                'accountId' => $accountId,
                'expectedChangeNumber' => 0,
            ])
            ->hiddenFrom('Member');
    }
}
