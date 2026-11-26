<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Agents\Drivers\Isolation\IsolationProbes;
use App\Commands\Hosts\RequestHostProtection\RequestHostProtectionCommand;
use App\Enums\Hosts\HostOrderType;
use App\Enums\Hosts\HostProcessPurpose;
use App\Models\Hosts\HostProcess;
use App\Models\Projects\Host;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A contained host's protection is brought up to date: the reports that need no probe are judged at once, and the
 * relay probe of Claude Code's sandbox opens once in a container of the agent image with no network and no mount; a
 * local host is left alone.
 */
#[TestsCommand(RequestHostProtectionCommand::class)]
final class RequestHostProtectionTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_contained_host_judges_what_needs_no_probe_and_opens_the_relay_probe_once(): void
    {
        $this->journal->enrollContainedHost('Box', [base_path()]);
        $hostId = $this->journal->hostCalled('Box')->hostId;

        $this->journal->asSystem(new RequestHostProtectionCommand($hostId));
        $this->journal->asSystem(new RequestHostProtectionCommand($hostId));
        $this->journal->callHostProcessOf('relay', 'Box', HostProcessPurpose::RelayProbe);
        $open = $this->journal->hostOrdersOf('relay')[0];
        $container = $this->journal->payloadOf($open)['container'];

        $this->journal->assertResult(
            [
                ['codex@0.165.0', 'codex@0.165.0/linux-container-protected', 'claude-code@2.1.323/linux-container-protected'],
                1,
                [HostOrderType::OpenContainer, IsolationProbes::SOCAT_ARGV, 'none', []],
            ],
            [
                array_keys(Host::query()->whereKey($hostId)->sole()->protection->items()),
                HostProcess::query()->where('purpose', HostProcessPurpose::RelayProbe)->count(),
                [$open->type, $this->journal->payloadOf($open)['argv'], $container['network'], $container['mounts']],
            ],
        );
    }

    public function test_a_local_host_is_left_alone(): void
    {
        $this->journal->enrollHost('Mac', [base_path()]);
        $hostId = $this->journal->hostCalled('Mac')->hostId;

        $this->journal->asSystem(new RequestHostProtectionCommand($hostId));

        $this->journal->assertResult(
            [[], 0],
            [Host::query()->whereKey($hostId)->sole()->protection->items(), HostProcess::query()->count()],
        );
    }
}
