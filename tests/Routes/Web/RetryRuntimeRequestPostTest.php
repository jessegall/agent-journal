<?php

declare(strict_types=1);

namespace Tests\Routes\Web;

use App\Commands\Drivers\RetryDriverRequest\RetryDriverRequestCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner retries a driver request that went astray.
 */
#[TestsRoute('POST', 'web.retry-runtime-request')]
final class RetryRuntimeRequestPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $requestId = strtolower((string) Str::ulid());

        return RouteCall::as(Caller::User)
            ->parameters([
                'driver_request' => $requestId,
            ])
            ->payload([
                'reason' => 'The host lost it.',
                'rowVersion' => 2,
            ])
            ->reply(RetryDriverRequestCommand::class, 3)
            ->expects(RetryDriverRequestCommand::class, [
                'requestId' => $requestId,
                'expectedRowVersion' => 2,
                'reason' => 'The host lost it.',
            ]);
    }
}
