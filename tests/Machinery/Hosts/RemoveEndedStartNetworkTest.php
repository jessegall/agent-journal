<?php

declare(strict_types=1);

namespace Tests\Machinery\Hosts;

use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Enums\SessionProcessStatus;
use App\Events\Sessions\SessionProcessStopped;
use App\Hosts\ArrangementSetting;
use App\Hosts\Protocol\HostInstructionType;
use App\Hosts\Protocol\HostProcessReportType;
use App\Listeners\RemoveEndedStartNetwork;
use App\Models\Sessions\SessionProcess;
use Tests\Support\Agents\TestAgent;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\Hosts\TestEnrolledHost;
use Tests\Support\Hosts\TestHostProcess;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Every end of a start on a contained host removes its session's network, also a start that failed before any runtime
 * opened, one whose agent retired since and one the host's own report ended, where no agent acts; a start on a host
 * that runs its processes itself made no network, so nothing is removed there.
 */
#[TestsMachinery(RemoveEndedStartNetwork::class)]
final class RemoveEndedStartNetworkTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_failed_start_on_a_contained_host_has_its_network_removed(): void
    {
        $this->journal->arrangeContainedJournal()->enrollContainedHost('Box', [base_path()]);
        $start = $this->endedStartOn('Box');

        $this->app->make(RemoveEndedStartNetwork::class)->handle(new SessionProcessStopped($start->id));

        // The stop's own event may have removed it already; either way the session's network is what is removed.
        $this->journal->assertResult(
            [$this->app->make(ArrangementSetting::class)->sessionContainerName($start->session_id)],
            array_values(array_unique(array_map(
                fn ($removal) => $this->journal->payloadOf($removal)['network'],
                $this->networkRemovalsOn('Box'),
            ))),
        );
    }

    public function test_the_ended_start_of_a_retired_agent_still_has_its_network_removed(): void
    {
        $this->journal->arrangeContainedJournal()->enrollContainedHost('Box', [base_path()]);
        $start = $this->endedStartOn('Box');
        $this->journal->withAgent('Driven', fn (TestAgent $driven) => $driven->retire());

        $this->app->make(RemoveEndedStartNetwork::class)->handle(new SessionProcessStopped($start->id));

        $this->journal->assertResult(
            [$this->app->make(ArrangementSetting::class)->sessionContainerName($start->session_id)],
            array_values(array_unique(array_map(
                fn ($removal) => $this->journal->payloadOf($removal)['network'],
                $this->networkRemovalsOn('Box'),
            ))),
        );
    }

    public function test_a_start_the_host_reports_ended_is_found_and_has_its_network_removed(): void
    {
        $this->journal->arrangeContainedJournal()->enrollContainedHost('Box', [base_path()]);
        $this->journal->owner()->chooseActiveAccounts()->showDriverArrangements()->idleAgent('Driven');
        $this->journal->withAgent('Driven', fn (TestAgent $driven) => $driven
            ->openRuntime('Box', base_path(), driverType: DriverType::Terminal));
        $sessionId = $this->journal->openedRuntimeOf('Driven')->sessionId;
        $this->journal->host('Box', fn (TestEnrolledHost $box) => $box->openProcessForStart('agent', $sessionId));

        $this->journal->hostProcess('agent', fn (TestHostProcess $agent) => $agent
            ->report(HostProcessReportType::Running)->report(HostProcessReportType::Exited, 0));

        $network = $this->app->make(ArrangementSetting::class)->sessionContainerName($sessionId);
        $this->journal->assertResult(
            [SessionProcessStatus::Stopped, [$network]],
            [
                $this->journal->startOfSession($sessionId)->status,
                array_values(array_unique(array_map(
                    fn ($removal) => $this->journal->payloadOf($removal)['network'],
                    $this->networkRemovalsOn('Box'),
                ))),
            ],
        );
    }

    public function test_a_start_on_a_host_that_runs_its_processes_itself_removes_no_network(): void
    {
        $this->journal->enrollHost('Mac', [base_path()]);
        $start = $this->endedStartOn('Mac');

        $this->app->make(RemoveEndedStartNetwork::class)->handle(new SessionProcessStopped($start->id));

        $this->assertSame([], $this->networkRemovalsOn('Mac'));
    }

    private function endedStartOn(string $host): SessionProcess
    {
        $this->journal->owner()->chooseActiveAccounts()->showDriverArrangements()->idleAgent('Driven');
        $this->journal->withAgent('Driven', fn (TestAgent $driven) => $driven->openRuntime($host, base_path()));
        $start = $this->journal->startOfSession($this->journal->openedRuntimeOf('Driven')->sessionId);
        $start->stopWithProof();

        return $start;
    }

    /**
     * @return list<mixed>
     */
    private function networkRemovalsOn(string $host): array
    {
        return array_values(array_filter(
            $this->journal->hostInstructionsOn($host),
            fn ($instruction) => $instruction->type === HostInstructionType::RemoveNetwork,
        ));
    }
}
