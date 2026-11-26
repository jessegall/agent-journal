<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Hosts\ArrangementSetting;
use App\Hosts\Commands\RemoveSessionContainer\RemoveSessionContainerCommand;
use App\Hosts\Enums\HostOrderType;
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
        $orders = $this->journal->hostOrdersOn('Box');
        $removal = $orders[array_key_last($orders)];
        $network = $this->app->make(ArrangementSetting::class)->sessionContainerName('s1');

        $this->journal->assertResult(
            [HostOrderType::Remove, ['container' => '', 'network' => $network, 'session' => 's1']],
            [$removal->type, $this->journal->payloadOf($removal)],
        );
    }
}
