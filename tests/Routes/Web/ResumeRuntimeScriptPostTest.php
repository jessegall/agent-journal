<?php

declare(strict_types=1);

namespace Tests\Routes\Web;

use App\Terminals\Commands\ResumeKeyScript\ResumeKeyScriptCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner resumes the key script a driver request paused.
 */
#[TestsRoute('POST', 'web.resume-runtime-script')]
final class ResumeRuntimeScriptPostTest extends GuardedRouteEntryTestCase
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
            ->reply(ResumeKeyScriptCommand::class, 3)
            ->expects(ResumeKeyScriptCommand::class, [
                'requestId' => $requestId,
                'expectedRowVersion' => 2,
                'reason' => 'The host lost it.',
            ]);
    }
}
