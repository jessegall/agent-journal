<?php

declare(strict_types=1);

namespace Tests\Routes\Connections;

use App\Hosts\EnrolledHost;
use App\Projects\Commands\StartDeviceGrant\StartDeviceGrantCommand;
use App\Projects\Values\DeviceGrantStart;
use Tests\Support\Connections\ConnectsProjects;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Entries\RouteEntryTestCase;
use Tests\Support\Seeding\TestJournal;

/**
 * A relay starts a terminal's sign-in on its binding, for the owner to approve.
 */
#[TestsRoute('POST', 'connections.device-grants.start')]
final class DeviceGrantsStartPostTest extends RouteEntryTestCase
{
    use ConnectsProjects;

    private const string NONCE = 'nonce-0123456789abcdef';

    protected function arrange(TestJournal $journal): RouteCall
    {
        [$relay, $bindingId] = $this->redeemedRelay();

        return RouteCall::as(Caller::Public, $relay)
            ->payload([
                'binding' => $bindingId,
                'startKey' => 'start-1',
            ])
            ->reply(
                StartDeviceGrantCommand::class,
                new DeviceGrantStart('DG-1', 1, 'ABCD-EFGH', '2026-11-26T10:15:00+00:00'),
            )
            ->expects(StartDeviceGrantCommand::class, [
                'hostId' => $relay->hostId,
                'bindingId' => $bindingId,
                'startKey' => 'start-1',
            ]);
    }

    /**
     * The relay a redeemed install line enrolled, signing with the credential it redeemed with, and its binding.
     *
     * @return array{EnrolledHost, string}
     */
    private function redeemedRelay(): array
    {
        $this->issueLine('the-ticket');
        $redemption = $this->redeemLine('the-ticket', self::NONCE)->assertCreated();

        return [
            new EnrolledHost((string) $redemption->json('hostId'), $this->relayCredential(self::NONCE)),
            (string) $redemption->json('bindingId'),
        ];
    }
}
