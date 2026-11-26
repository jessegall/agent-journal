<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Commands\Hosts\OpenHostProcess\OpenHostProcessCommand;
use App\Enums\Hosts\HostOrderType;
use App\Enums\Hosts\HostProcessPurpose;
use App\Enums\Hosts\HostProcessStatus;
use App\Enums\Hosts\HostProcessType;
use App\Enums\Hosts\RestartPolicy;
use App\Values\HostOrderSource;
use App\Values\HostProcessPlan;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * Opening a process makes its row, ordered and not yet running, and the open order the host claims.
 */
#[TestsCommand(OpenHostProcessCommand::class)]
final class OpenHostProcessTest extends TestCase
{
    public function test_a_native_process_is_made_with_its_open_order(): void
    {
        $this->journal->enrollHost('Mac', [base_path()]);
        $plan = new HostProcessPlan(
            HostProcessPurpose::Probe,
            HostProcessType::Pipe,
            RestartPolicy::OnCrash,
            ['git', 'status'],
            ['LANG' => 'C'],
            base_path(),
        );

        $processId = $this->journal->asSystem(new OpenHostProcessCommand(
            $this->journal->hostCalled('Mac')->hostId,
            null,
            $plan,
            HostOrderSource::fromJournal(),
        ));

        $order = $process->openOrder;
        $this->journal->assertResult(
            [HostProcessStatus::Ordered, RestartPolicy::OnCrash, HostOrderType::OpenProcess, $plan->payload()],
            [$process->status, $process->restart, $order->type, $order->payload],
        );
    }
}
