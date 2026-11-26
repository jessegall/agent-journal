<?php

declare(strict_types=1);

namespace Tests\Routes\Connections;

use Tests\Support\Connections\ConnectsProjects;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Entries\RouteEntryTestCase;
use Tests\Support\Seeding\TestJournal;

/**
 * A machine fetches the install script of a line the owner issued: nothing is sent on.
 */
#[TestsRoute('GET', 'connections.install')]
final class InstallGetTest extends RouteEntryTestCase
{
    use ConnectsProjects;

    private const string NONCE = 'nonce-0123456789abcdef';

    protected function arrange(TestJournal $journal): RouteCall
    {
        $this->issueLine('the-ticket');

        return RouteCall::as(Caller::Public)->parameters([
            'ticket' => 'the-ticket',
        ]);
    }
}
