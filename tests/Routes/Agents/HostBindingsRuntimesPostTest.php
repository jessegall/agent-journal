<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Agents\Commands\OpenBindingMainRuntime\OpenBindingMainRuntimeCommand;
use App\Agents\Drivers\Enums\DriverType;
use App\Hosts\EnrolledHost;
use App\Projects\Commands\AssertBindingRuntime\AssertBindingRuntimeCommand;
use Illuminate\Support\Str;
use Tests\Support\Agents\TestAgent;
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
        $opened = $journal->chooseActiveAccounts()
            ->idleAgent('Binding main')
            ->enrollHost('Runtime host', ['/work'])
            ->withAgent('Binding main', fn (TestAgent $main) => $main
                ->openRuntime('Runtime host', '/work', driverType: DriverType::Terminal))
            ->openedRuntimeOf('Binding main');

        return RouteCall::as(Caller::RelayHost, $relay)
            ->parameters([
                'binding' => $bindingId,
            ])
            ->payload([
                'rootId' => 'root-1',
                'folder' => '/Users/owner/shop',
                'agentId' => $agentId,
                'driver' => 'claude-code',
                'profile' => 'main-agent',
                'model' => 'claude-opus-5-5',
            ])
            ->reply(OpenBindingMainRuntimeCommand::class, $opened)
            ->expects(AssertBindingRuntimeCommand::class, [
                'hostId' => $relay->hostId,
                'bindingId' => $bindingId,
                'agentId' => $agentId,
            ])
            ->expects(OpenBindingMainRuntimeCommand::class, [
                'agentId' => $agentId,
                'hostId' => $relay->hostId,
                'folder' => '/Users/owner/shop',
                'driver' => 'claude-code',
                'model' => 'claude-opus-5-5',
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
