<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Commands\Hosts\MarkSilentHosts\MarkSilentHostsCommand;
use App\Commands\Hosts\NotifyHostHeartbeat\NotifyHostHeartbeatCommand;
use App\Support\HostLinkAlarms;
use Carbon\CarbonImmutable;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * A host whose heartbeat has been silent for 90 seconds is shown failing; one that beat lately is not.
 */
#[TestsCommand(MarkSilentHostsCommand::class)]
final class MarkSilentHostsTest extends TestCase
{
    public function test_a_host_silent_for_90_seconds_is_shown_failing(): void
    {
        $this->journal->useServerClockAt(CarbonImmutable::parse('2026-11-26 10:00:00'))->enrollHost('Mac', [base_path()]);
        $this->journal->asSystem(new NotifyHostHeartbeatCommand($this->journal->hostCalled('Mac')->hostId, [], null));
        $this->journal->asSystem(new MarkSilentHostsCommand());
        $quietAt60 = $this->journal->service(HostLinkAlarms::class)->current();

        $this->journal->travelTo(CarbonImmutable::parse('2026-11-26 10:03:00'));
        $this->journal->asSystem(new MarkSilentHostsCommand());

        $this->journal->assertResult(
            [[], 1],
            [$quietAt60, count($this->journal->service(HostLinkAlarms::class)->current())],
        );
    }
}
