<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Hosts\ArrangementSetting;
use App\Hosts\Commands\RemoveSessionNetwork\RemoveSessionNetworkCommand;
use App\Hosts\Protocol\HostInstructionType;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

#[TestsCommand(RemoveSessionNetworkCommand::class)]
final class RemoveSessionNetworkTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_the_host_is_ordered_to_remove_the_sessions_network(): void
    {
        $this->journal->enrollContainedHost('Box', [base_path()]);
        $hostId = $this->journal->hostCalled('Box')->hostId;

        $this->journal->asSystem(new RemoveSessionNetworkCommand($hostId, 's1'));
        $removal = array_slice($this->journal->hostInstructionsOn('Box'), -1)[0];

        $this->journal->assertResult(
            [
                HostInstructionType::RemoveNetwork,
                ['network' => $this->app->make(ArrangementSetting::class)->sessionContainerName('s1')],
            ],
            [$removal->type, $this->journal->payloadOf($removal)],
        );
    }
}
