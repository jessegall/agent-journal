<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Agents\Drivers\Enums\DriverType;
use App\Exceptions\HostProtocolRefused;
use App\Hosts\Commands\OpenHostProcess\OpenHostProcessCommand;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Enums\HostProcessStatus;
use App\Hosts\Enums\RestartPolicy;
use App\Hosts\Protocol\HostOrderType;
use App\Hosts\Protocol\HostProcessType;
use App\Models\Hosts\HostOrder;
use App\Models\Hosts\HostProcess;
use App\Values\HostOrderSource;
use App\Values\HostProcessPlan;
use Tests\Support\Agents\TestAgent;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Hosts\TestEnrolledHost;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Opening a process makes its row, ordered and not yet running, and the open order the host claims; a process of a
 * start runs under its session's fence.
 */
#[TestsCommand(OpenHostProcessCommand::class)]
final class OpenHostProcessTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_native_process_is_made_with_its_open_order(): void
    {
        $this->journal->enrollHost('Mac', [base_path()]);
        $plan = new HostProcessPlan(
            HostProcessPurpose::Probe,
            HostProcessType::Pipe,
            RestartPolicy::OnCrash,
            ['git', 'status'],
            ['LANG=C'],
            base_path(),
        );

        $processId = $this->journal->asSystem(new OpenHostProcessCommand(
            $this->journal->hostCalled('Mac')->hostId,
            null,
            $plan,
            HostOrderSource::fromJournal(),
        ));

        $process = HostProcess::query()->whereKey($processId)->sole();
        $order = HostOrder::query()->whereKey($process->open_order_id)->sole();
        $this->journal->assertResult(
            [HostProcessStatus::Ordered, RestartPolicy::OnCrash, HostOrderType::OpenProcess, $plan->payload()->toArray()],
            [$process->status, $process->restart, $order->type, $this->journal->payloadOf($order)],
        );
    }

    public function test_a_process_of_a_start_runs_under_its_sessions_fence(): void
    {
        $this->journal->owner()->showDriverArrangements()->chooseActiveAccounts()->idleAgent('Fenced')
            ->enrollHost('Mac', [base_path()]);
        $this->journal->withAgent('Fenced', fn (TestAgent $fenced) => $fenced
            ->openRuntime('Mac', base_path(), driverType: DriverType::Terminal));
        $opened = $this->journal->openedRuntimeOf('Fenced');

        $this->journal->host('Mac', fn (TestEnrolledHost $mac) => $mac
            ->openProcessForStart('terminal', $opened->sessionId));

        $order = $this->journal->hostOrdersOf('terminal')[0];
        $this->journal->assertResult($opened->sessionId, $this->journal->payloadOf($order)['fence']);
    }

    public function test_a_contained_plan_carrying_part_of_its_start_grant_is_refused_naming_what_it_misses(): void
    {
        $this->journal->enrollHost('Mac', [base_path()]);

        $this->journal->assertRefused(
            HostProtocolRefused::class,
            fn () => $this->journal->host('Mac', fn (TestEnrolledHost $mac) => $mac
                ->openContainer('agent', ['JOURNAL_START_TOKEN=token', 'JOURNAL_PROFILE=default'])),
            fn (HostProtocolRefused $refusal) => $this->journal->assertResult(
                true,
                str_contains($refusal->getMessage(), 'misses JOURNAL_URL, JOURNAL_PROFILE_REVISION'),
            ),
        );
    }
}
