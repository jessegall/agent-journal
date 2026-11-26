<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Commands\Hosts\MarkSilentHosts\MarkSilentHostsCommand;
use App\Commands\Hosts\NotifyHostHeartbeat\NotifyHostHeartbeatCommand;
use App\Commands\Hosts\NotifyHostInventory\NotifyHostInventoryCommand;
use App\Support\HostLinkAlarms;
use Carbon\CarbonImmutable;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A host whose heartbeat has been silent for 90 seconds is shown failing, one that beat lately is not, and a host
 * whose inventory names another release than the journal's is shown with what the owner can do.
 */
#[TestsCommand(MarkSilentHostsCommand::class)]
final class MarkSilentHostsTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_host_silent_for_90_seconds_is_shown_failing(): void
    {
        $start = CarbonImmutable::parse('2026-11-26 10:00:00');
        $this->journal->travelTo($start)->useServerClockAt($start)->enrollHost('Mac', [base_path()]);
        $this->journal->asSystem(new NotifyHostHeartbeatCommand($this->journal->hostCalled('Mac')->hostId, [], null));
        $this->journal->asSystem(new MarkSilentHostsCommand());
        $quietAt60 = $this->journal->service(HostLinkAlarms::class)->current();

        $later = CarbonImmutable::parse('2026-11-26 10:03:00');
        $this->journal->travelTo($later)->useServerClockAt($later);
        $this->journal->asSystem(new MarkSilentHostsCommand());

        $this->journal->assertResult(
            [[], 1],
            [$quietAt60, count($this->journal->service(HostLinkAlarms::class)->current())],
        );
    }

    public function test_a_host_on_another_release_than_the_journals_is_shown_with_what_to_do(): void
    {
        $this->journal->publishRelease('6.2.0')->enrollHost('Mac', [base_path()]);
        $hostId = $this->journal->hostCalled('Mac')->hostId;
        $inventory = json_encode(['protocol' => 1, 'release' => '6.1.0', 'processes' => []], JSON_THROW_ON_ERROR);
        $this->journal->asSystem(new NotifyHostInventoryCommand($hostId, $inventory));
        $behind = $this->journal->service(HostLinkAlarms::class)->current();

        $current = json_encode(['protocol' => 1, 'release' => '6.2.0', 'processes' => []], JSON_THROW_ON_ERROR);
        $this->journal->asSystem(new NotifyHostInventoryCommand($hostId, $current));

        $this->journal->assertResult(
            [
                [
                    "The host Mac runs release 6.1.0, not the journal's 6.2.0: run its install line again on that "
                    .'machine to bring it up to date.',
                ],
                [],
            ],
            [$behind, $this->journal->service(HostLinkAlarms::class)->current()],
        );
    }
}
