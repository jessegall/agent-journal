<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Commands\Projects\RecordBindingPresence\RecordBindingPresenceCommand;
use App\Support\EnrolledHost;
use App\Values\PresenceReceipt;
use Tests\Support\Connections\ConnectsProjects;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * A relay reports that it is present on its binding's folder.
 */
#[TestsRoute('POST', 'agents.host.bindings.presence')]
final class HostBindingsPresencePostTest extends GuardedRouteEntryTestCase
{
    use ConnectsProjects;

    private const string NONCE = 'nonce-0123456789abcdef';

    protected function arrange(TestJournal $journal): RouteCall
    {
        [$relay, $bindingId] = $this->redeemedRelay();

        return RouteCall::as(Caller::RelayHost, $relay)
            ->parameters([
                'binding' => $bindingId,
            ])
            ->payload([
                'bootId' => 'boot-1',
                'sequence' => 1,
                'release' => '1.0.0',
                'provisioning' => 'succeeded',
            ])
            ->reply(RecordBindingPresenceCommand::class, new PresenceReceipt(
                $bindingId,
                1,
                0,
                '2026-11-26T10:00:00+00:00',
                '2026-11-26T10:05:00+00:00',
                1,
                'ready',
                null,
            ))
            ->expects(RecordBindingPresenceCommand::class, [
                'hostId' => $relay->hostId,
                'bindingId' => $bindingId,
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
