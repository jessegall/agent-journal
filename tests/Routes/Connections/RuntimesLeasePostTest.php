<?php

declare(strict_types=1);

namespace Tests\Routes\Connections;

use App\Commands\Agents\RenewRuntimeLease\RenewRuntimeLeaseCommand;
use App\Support\EnrolledHost;
use App\Values\RuntimeLease;
use Illuminate\Support\Str;
use Tests\Support\Connections\ConnectsProjects;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * A relay renews the lease of a runtime it runs for its binding.
 */
#[TestsRoute('POST', 'connections.runtimes.lease')]
final class RuntimesLeasePostTest extends GuardedRouteEntryTestCase
{
    use ConnectsProjects;

    private const string NONCE = 'nonce-0123456789abcdef';

    protected function arrange(TestJournal $journal): RouteCall
    {
        [$relay, $bindingId] = $this->redeemedRelay();
        $runtimeId = strtolower((string) Str::ulid());

        return RouteCall::as(Caller::RelayHost, $relay)
            ->parameters([
                'binding' => $bindingId,
                'runtime' => $runtimeId,
            ])
            ->payload([
                'authorityGeneration' => 1,
                'runtimeGeneration' => 1,
            ])
            ->reply(RenewRuntimeLeaseCommand::class, new RuntimeLease(
                $runtimeId,
                1,
                '2026-11-26T10:00:00+00:00',
                '2026-11-26T10:05:00+00:00',
            ))
            ->expects(RenewRuntimeLeaseCommand::class, [
                'hostId' => $relay->hostId,
                'bindingId' => $bindingId,
                'runtimeId' => $runtimeId,
                'authorityGeneration' => 1,
                'runtimeGeneration' => 1,
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
