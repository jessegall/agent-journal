<?php

declare(strict_types=1);

namespace Tests\Routes\Connections;

use App\Hosts\EnrolledHost;
use App\Projects\Commands\RecordBindingRuntimeStop\RecordBindingRuntimeStopCommand;
use Illuminate\Support\Str;
use Tests\Support\Connections\ConnectsProjects;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * A relay reports that a runtime of its binding stopped.
 */
#[TestsRoute('POST', 'connections.runtimes.stopped')]
final class RuntimesStoppedPostTest extends GuardedRouteEntryTestCase
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
            ->expects(RecordBindingRuntimeStopCommand::class, [
                'hostId' => $relay->hostId,
                'bindingId' => $bindingId,
                'runtimeId' => $runtimeId,
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
