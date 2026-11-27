<?php

declare(strict_types=1);

namespace Tests\Machinery\Hosts;

use App\Hosts\Enums\HostOrderType;
use App\Hosts\Enums\HostProcessReportType;
use App\Listeners\RemoveEndedContainers;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\Hosts\TestEnrolledHost;
use Tests\Support\Hosts\TestHostProcess;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A process of a contained host that ends has its container removed; one of a host that runs its processes itself
 * leaves nothing to remove.
 */
#[TestsMachinery(RemoveEndedContainers::class)]
final class RemoveEndedContainersTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_an_ended_process_of_a_contained_host_has_its_container_removed(): void
    {
        $this->journal->enrollContainedHost('Box', [base_path()])
            ->enrollHost('Mac', [base_path()])
            ->host('Box', fn (TestEnrolledHost $box) => $box->openProcess('contained'))
            ->host('Mac', fn (TestEnrolledHost $mac) => $mac->openProcess('native'))
            ->hostProcess('contained', fn (TestHostProcess $contained) => $contained
                ->report(HostProcessReportType::Running)->report(HostProcessReportType::Exited, 0))
            ->hostProcess('native', fn (TestHostProcess $native) => $native
                ->report(HostProcessReportType::Running)->report(HostProcessReportType::Exited, 0));
        $removalsOn = fn (string $host) => array_values(array_filter(
            $this->journal->hostOrdersOn($host),
            fn ($order) => $order->type === HostOrderType::Remove,
        ));
        $contained = $this->journal->hostProcessCalled('contained')->containerName();

        $this->journal->assertResult(
            [[$contained], []],
            [
                array_map(fn ($order) => $this->journal->payloadOf($order)['container'], $removalsOn('Box')),
                $removalsOn('Mac'),
            ],
        );
    }
}
