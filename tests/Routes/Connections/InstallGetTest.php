<?php

declare(strict_types=1);

namespace Tests\Routes\Connections;

use App\Commands\Projects\RevokeProjectInvitation\RevokeProjectInvitationCommand;
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

    private const string UNUSABLE_LINE = 'journal: this install line cannot be used. '
        ."Copy a new one from the journal.\n";

    public function test_a_revoked_line_answers_the_generic_failure(): void
    {
        $invitation = $this->issueLine('the-ticket');
        $this->journal->asOwner(new RevokeProjectInvitationCommand($invitation->id));

        $this->assertSame(
            self::UNUSABLE_LINE,
            $this->journal->route('GET', 'connections.install', ['ticket' => 'the-ticket'])->assertNotFound()->getContent(),
        );
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $this->issueLine('the-ticket');

        return RouteCall::as(Caller::Public)->parameters([
            'ticket' => 'the-ticket',
        ]);
    }
}
