<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Hosts\ArrangementSetting;
use App\Hosts\Commands\RemoveSessionContainer\RemoveSessionContainerCommand;
use App\Hosts\Protocol\HostInstructionType;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

#[TestsCommand(RemoveSessionContainerCommand::class)]
final class RemoveSessionContainerTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_the_host_is_ordered_to_remove_the_sessions_network_and_plan_files(): void
    {
        $this->journal->enrollContainedHost('Box', [base_path()]);
        $hostId = $this->journal->hostCalled('Box')->hostId;

        $this->journal->asSystem(new RemoveSessionContainerCommand($hostId, 's1'));
        $instructions = $this->journal->hostInstructionsOn('Box');
        [$files, $network] = array_slice($instructions, -2);
        $networkName = $this->app->make(ArrangementSetting::class)->sessionContainerName('s1');

        $this->journal->assertResult(
            [
                HostInstructionType::RunContainers,
                ['session-files-remove', '/sessions/s1'],
                HostInstructionType::RemoveNetwork,
                ['network' => $networkName],
            ],
            [
                $files->type,
                array_slice($this->journal->payloadOf($files)['runs'][0]['command'], 3, 2),
                $network->type,
                $this->journal->payloadOf($network),
            ],
        );
    }
}
