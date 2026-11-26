<?php

declare(strict_types=1);

namespace Tests\Routes\Web;

use App\Terminals\Commands\CancelKeyScript\CancelKeyScriptCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner cancels the key script a driver request is running.
 */
#[TestsRoute('POST', 'web.cancel-runtime-script')]
final class CancelRuntimeScriptPostTest extends GuardedRouteEntryTestCase
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
            ->reply(CancelKeyScriptCommand::class, 3)
            ->expects(CancelKeyScriptCommand::class, [
                'requestId' => $requestId,
                'expectedRowVersion' => 2,
                'reason' => 'The host lost it.',
            ]);
    }
}
