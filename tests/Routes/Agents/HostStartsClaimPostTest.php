<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Commands\Agents\ClaimStart\ClaimStartCommand;
use App\Enums\Sessions\TransportProfileType;
use App\Support\AccountStartRecipe;
use App\Support\ClaimedStart;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host claims a start that waits for it.
 */
#[TestsRoute('POST', 'agents.host.starts.claim')]
final class HostStartsClaimPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();
        $sessionId = strtolower((string) Str::ulid());

        return RouteCall::as(Caller::SharedHost, $host)
            ->payload([
                'session_id' => $sessionId,
            ])
            ->reply(ClaimStartCommand::class, new ClaimedStart(
                'start-1',
                $sessionId,
                '/journal/accounts/home',
                1,
                'oauth',
                new AccountStartRecipe(
                    [],
                    [],
                    [],
                    [],
                    [],
                    '2.1.323',
                    str_repeat('a', 64),
                    'local',
                    '',
                    TransportProfileType::Mcp,
                    [],
                ),
                null,
                false,
            ))
            ->expects(ClaimStartCommand::class, [
                'hostId' => $host->hostId,
                'sessionId' => $sessionId,
            ]);
    }
}
