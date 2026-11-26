<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Commands\Projects\AssertBindingRuntime\AssertBindingRuntimeCommand;
use App\Support\EnrolledHost;
use Illuminate\Support\Str;
use Tests\Support\Connections\ConnectsProjects;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * A relay records the main runtime it runs for its binding.
 */
#[TestsRoute('POST', 'agents.host.bindings.runtimes')]
final class HostBindingsRuntimesPostTest extends GuardedRouteEntryTestCase
{
    use ConnectsProjects;

    private const string NONCE = 'nonce-0123456789abcdef';

    protected function arrange(TestJournal $journal): RouteCall
    {
        [$relay, $bindingId] = $this->redeemedRelay();
        $agentId = strtolower((string) Str::ulid());

        return RouteCall::as(Caller::RelayHost, $relay)
            ->parameters([
                'binding' => $bindingId,
            ])
            ->payload([
                'rootId' => 'root-1',
                'folder' => '/Users/owner/shop',
                'agentId' => $agentId,
                'driver' => 'claude-code',
                'driverBuild' => '2.1.323',
                'profile' => 'main-agent',
                'model' => 'claude-opus-5-5',
            ])
            ->expects(AssertBindingRuntimeCommand::class, [
                'hostId' => $relay->hostId,
                'bindingId' => $bindingId,
                'agentId' => $agentId,
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
