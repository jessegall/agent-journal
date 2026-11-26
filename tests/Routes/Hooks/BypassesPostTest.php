<?php

declare(strict_types=1);

namespace Tests\Routes\Hooks;

use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent's host uploads the hook bypasses it logged while the journal was away: they are kept and nothing is sent on.
 */
#[TestsRoute('POST', 'hooks.bypasses')]
final class BypassesPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        return RouteCall::as(Caller::Agent, $journal->signedStart('Writer'))->payload([
            'bypasses' => [
                [
                    'nativeEvent' => 'PreToolUse',
                    'failure' => 'The journal did not answer.',
                    'occurredAt' => '2026-11-26T10:00:00+00:00',
                ],
            ],
        ]);
    }
}
