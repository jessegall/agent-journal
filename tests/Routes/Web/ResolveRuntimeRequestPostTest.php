<?php

declare(strict_types=1);

namespace Tests\Routes\Web;

use App\Agents\Drivers\Commands\ResolveDriverDelivery\ResolveDriverDeliveryCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner settles whether a driver request whose delivery is unknown was applied.
 */
#[TestsRoute('POST', 'web.resolve-runtime-request')]
final class ResolveRuntimeRequestPostTest extends GuardedRouteEntryTestCase
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
                'applied' => true,
            ])
            ->reply(ResolveDriverDeliveryCommand::class, 3)
            ->expects(ResolveDriverDeliveryCommand::class, [
                'requestId' => $requestId,
                'expectedRowVersion' => 2,
                'isApplied' => true,
                'reason' => 'The host lost it.',
            ]);
    }
}
