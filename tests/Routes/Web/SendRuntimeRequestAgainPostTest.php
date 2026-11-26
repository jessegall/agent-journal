<?php

declare(strict_types=1);

namespace Tests\Routes\Web;

use App\Commands\Drivers\SendDriverRequestAgain\SendDriverRequestAgainCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner sends a driver request again, knowing it may arrive twice.
 */
#[TestsRoute('POST', 'web.send-runtime-request-again')]
final class SendRuntimeRequestAgainPostTest extends GuardedRouteEntryTestCase
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
                'confirmsPossibleDuplicate' => true,
            ])
            ->reply(SendDriverRequestAgainCommand::class, strtolower((string) Str::ulid()))
            ->expects(SendDriverRequestAgainCommand::class, [
                'requestId' => $requestId,
                'confirmsPossibleDuplicate' => true,
                'reason' => 'The host lost it.',
            ]);
    }
}
