<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Agents\Drivers\DefaultDrivers;
use App\Commands\Hosts\JudgeHostProtection\JudgeHostProtectionCommand;
use App\Enums\Drivers\IsolationPlatform;
use App\Models\Projects\Host;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A judged report keeps each item of the driver's pinned build on the platform: Codex in the standard container has
 * no mechanism but for its writes, which await their recorded run.
 */
#[TestsCommand(JudgeHostProtectionCommand::class)]
final class JudgeHostProtectionTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_codex_in_the_standard_container_is_kept_from_everything_but_its_writes(): void
    {
        $this->journal->enrollContainedHost('Box', [base_path()]);
        $hostId = $this->journal->hostCalled('Box')->hostId;

        $this->journal->asSystem(new JudgeHostProtectionCommand($hostId, DefaultDrivers::CODEX, IsolationPlatform::Container));
        $report = Host::query()->whereKey($hostId)->sole()->protection->items()['codex@0.165.0']->report();

        $this->journal->assertResult(
            ['no native mechanism', 'no native mechanism', 'native evidence missing', false],
            [
                substr($report->items[0]->reason, 0, 19),
                substr($report->items[4]->reason, 0, 19),
                substr($report->items[5]->reason, 0, 23),
                $report->isEnforcedInContainer(),
            ],
        );
    }
}
