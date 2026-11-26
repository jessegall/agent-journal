<?php

declare(strict_types=1);

namespace Tests\Routes\Accounts;

use App\Commands\Accounts\DismissAccountNotice\DismissAccountNoticeCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner dismisses a notice about their accounts.
 */
#[TestsRoute('POST', 'accounts.dismiss')]
final class DismissPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner()->user('Member');
        $noticeId = strtolower((string) Str::ulid());

        return RouteCall::as(Caller::User)
            ->parameters([
                'notice' => $noticeId,
            ])
            ->expects(DismissAccountNoticeCommand::class, [
                'noticeId' => $noticeId,
            ])
            ->hiddenFrom('Member');
    }
}
