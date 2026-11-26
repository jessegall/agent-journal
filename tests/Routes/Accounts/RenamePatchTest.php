<?php

declare(strict_types=1);

namespace Tests\Routes\Accounts;

use App\Accounts\Commands\RenameAccount\RenameAccountCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner renames an account, at the name revision the page showed.
 */
#[TestsRoute('PATCH', 'accounts.rename')]
final class RenamePatchTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner()->user('Member');
        $accountId = strtolower((string) Str::ulid());

        return RouteCall::recorded('account-rename', [
            '01JPAGEREQUESTACCOUNT00000' => $accountId,
        ])
            ->expects(RenameAccountCommand::class, [
                'accountId' => $accountId,
                'label' => 'Home',
                'seenRevision' => 1,
            ])
            ->hiddenFrom('Member');
    }
}
