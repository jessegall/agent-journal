<?php

declare(strict_types=1);

namespace Tests\Machinery\Hosts;

use App\Access\Values\OwnerAuthority;
use App\Actors\Contracts\CurrentActorSetter;
use App\Events\Sessions\SessionProcessStopped;
use App\Hosts\ArrangementSetting;
use App\Hosts\Protocol\HostInstructionType;
use App\Listeners\RemoveEndedStartNetwork;
use App\Models\Sessions\SessionProcess;
use App\Sessions\StartSessions;
use App\Support\ActorReference;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * Every end of a start on a contained host removes its session's network, also a start that failed before any runtime
 * opened; a start on a host that runs its processes itself made no network, so nothing is removed there.
 */
#[TestsMachinery(RemoveEndedStartNetwork::class)]
final class RemoveEndedStartNetworkTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_failed_start_on_a_contained_host_has_its_network_removed(): void
    {
        $this->journal->enrollContainedHost('Box', [base_path()]);
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

    public function test_a_start_on_a_host_that_runs_its_processes_itself_removes_no_network(): void
    {
        $this->journal->enrollHost('Mac', [base_path()]);
        $start = $this->endedStartOn('Mac');

        $this->app->make(RemoveEndedStartNetwork::class)->handle(new SessionProcessStopped($start->id));

        $this->assertSame([], $this->networkRemovalsOn('Mac'));
    }

    private function endedStartOn(string $host): SessionProcess
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorReference::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );
        $agent = $this->journal->idleAgent('Main agent', 'main-agent')->agentCalled('Main agent');
        $session = $this->app->make(StartSessions::class)
            ->start($agent, TestSelections::of('claude-code'), TestSelections::requestId())
            ->session;
        $start = $this->journal->claimStartOf($this->journal->hostCalled($host)->hostId, $session->id);
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
