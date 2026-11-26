<?php

declare(strict_types=1);

namespace Tests\Routes\Web;

use App\Commands\Drivers\CancelDriverRequest\CancelDriverRequestCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner cancels a driver request that went astray.
 */
#[TestsRoute('POST', 'web.cancel-runtime-request')]
final class CancelRuntimeRequestPostTest extends GuardedRouteEntryTestCase
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
            ->reply(CancelDriverRequestCommand::class, 3)
            ->expects(CancelDriverRequestCommand::class, [
                'requestId' => $requestId,
                'expectedRowVersion' => 2,
                'reason' => 'The host lost it.',
            ]);
    }
}
