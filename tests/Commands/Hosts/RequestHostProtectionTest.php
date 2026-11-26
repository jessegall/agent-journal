<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Hosts\Commands\RequestHostProtection\RequestHostProtectionCommand;
use App\Models\Hosts\HostProcess;
use App\Models\Projects\Host;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A contained host's protection is brought up to date: every driver's report on each container platform is judged
 * once, and no probe opens; a local host is left alone.
 */
#[TestsCommand(RequestHostProtectionCommand::class)]
final class RequestHostProtectionTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_contained_host_judges_every_driver_on_both_container_platforms_once_and_opens_nothing(): void
    {
        $this->journal->enrollContainedHost('Box', [base_path()]);
        $hostId = $this->journal->hostCalled('Box')->hostId;

        $this->journal->asSystem(new RequestHostProtectionCommand($hostId));
        $this->journal->asSystem(new RequestHostProtectionCommand($hostId));

        $this->journal->assertResult(
            [
                [
                    'claude-code@2.1.323',
                    'claude-code@2.1.323/linux-container-protected',
                    'codex@0.165.0',
                    'codex@0.165.0/linux-container-protected',
                ],
                0,
            ],
            [
                $this->sorted(array_keys(Host::query()->whereKey($hostId)->sole()->protection->items())),
                HostProcess::query()->count(),
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

    /**
     * @param  list<string>  $keys
     * @return list<string>
     */
    private function sorted(array $keys): array
    {
        sort($keys);

        return $keys;
    }
}
