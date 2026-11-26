<?php

declare(strict_types=1);

namespace Tests\Routes\Connections;

use App\Commands\Projects\PollDeviceGrant\PollDeviceGrantCommand;
use App\Support\EnrolledHost;
use App\Values\DevicePollOutcome;
use App\Values\InstallTicket;
use Tests\Support\Connections\ConnectsProjects;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Entries\RouteEntryTestCase;
use Tests\Support\Seeding\TestJournal;

/**
 * A relay asks whether the owner approved its terminal's sign-in, and takes the grant once they did.
 */
#[TestsRoute('POST', 'connections.device-grants.poll')]
final class DeviceGrantsPollPostTest extends RouteEntryTestCase
{
    use ConnectsProjects;

    private const string NONCE = 'nonce-0123456789abcdef';

    protected function arrange(TestJournal $journal): RouteCall
    {
        [$relay] = $this->redeemedRelay();

        return RouteCall::as(Caller::Public, $relay)
            ->payload([
                'deviceCode' => 'the-device-code',
            ])
            ->reply(PollDeviceGrantCommand::class, new DevicePollOutcome(DevicePollOutcome::ISSUED, 'DG-1'))
            ->expects(PollDeviceGrantCommand::class, [
                'hostId' => $relay->hostId,
                'deviceCodeDigest' => InstallTicket::digestOf('the-device-code'),
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
