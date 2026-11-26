<?php

declare(strict_types=1);

namespace Tests\Routes\Connections;

use App\Commands\Projects\RedeemProjectInvitation\RedeemProjectInvitationCommand;
use App\Values\Redemption;
use Illuminate\Routing\UrlGenerator;
use Illuminate\Support\Str;
use Tests\Support\Connections\ConnectsProjects;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Entries\RouteEntryTestCase;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\TestProjects;

/**
 * A new relay redeems an install line and is enrolled with its folder bound to the project.
 */
#[TestsRoute('POST', 'connections.redeem')]
final class RedeemPostTest extends RouteEntryTestCase
{
    use ConnectsProjects;

    private const string NONCE = 'nonce-0123456789abcdef';

    public function test_a_redemption_without_tls_is_refused_and_nothing_is_sent(): void
    {
        $this->issueLine('the-ticket');
        $this->journal->sinkCommands();

        $this->journal->jsonRoute('POST', 'connections.redeem', payload: $this->redemptionBody('the-ticket', self::NONCE))
            ->assertForbidden();

        $this->journal->assertDispatchedExactly([]);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $this->issueLine('the-ticket');
        // A relay redeems over https only, as the request refuses plain http.
        $this->app->make(UrlGenerator::class)->forceScheme('https');

        return RouteCall::as(Caller::Public)
            ->payload($this->redemptionBody('the-ticket', self::NONCE))
            ->reply(RedeemProjectInvitationCommand::class, new Redemption(
                strtolower((string) Str::ulid()),
                TestProjects::local()->id,
                strtolower((string) Str::ulid()),
                strtolower((string) Str::ulid()),
                'Shop',
            ))
            ->expects(RedeemProjectInvitationCommand::class, [
                'ticket' => 'the-ticket',
                'hostCredential' => $this->relayCredential(self::NONCE),
                'projectLabel' => 'Shop',
            ]);
    }
}
