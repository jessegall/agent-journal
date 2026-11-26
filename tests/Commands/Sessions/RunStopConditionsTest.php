<?php

declare(strict_types=1);

namespace Tests\Commands\Sessions;

use App\Agents\Drivers\Enums\DriverType;
use App\Hosts\Enums\HostOrderType;
use App\Hosts\Enums\HostProcessReportType;
use App\Hosts\Enums\HostRefusal;
use App\Models\Agents\AgentRuntime;
use App\Sessions\Commands\RunStopConditions\RunStopConditionsCommand;
use App\Values\StopCondition;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A stop's attempt has its conditions run on its runtime's host under the session's fence, the agent's own terminal
 * waiting on them; an attempt of a session with no runtime stays pending, and a settled one is not run again.
 */
#[TestsCommand(RunStopConditionsCommand::class)]
final class RunStopConditionsTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_an_opened_attempt_orders_its_conditions_under_the_sessions_fence(): void
    {
        $this->journal->owner()->showDriverArrangements()->chooseActiveAccounts()->idleAgent('Writer', 'writing-helper')
            ->enrollHost('Mac', [base_path()]);
        $opened = $this->journal->openRuntimeOn('Writer', 'Mac', base_path(), driverType: DriverType::Terminal);
        $this->journal->openHostProcessForStart('Mac', 'terminal', $opened->sessionId)
            ->reportHostProcess('terminal', HostProcessReportType::Running);

        $attempt = $this->journal->openStopAttempt($opened->sessionId);

        $order = $this->journal->hostOrdersOn('Mac')[0];
        $payload = $this->journal->payloadOf($order);
        $condition = StopCondition::cleanWorktree();
        $workspace = AgentRuntime::query()->whereKey($opened->runtimeId)->sole()->canonical_folder;
        $this->journal->assertResult(
            [
                HostOrderType::RunFenced,
                $opened->sessionId,
                [$this->journal->hostProcessCalled('terminal')->id],
                [
                    $condition->executable,
                    ...$condition->arguments,
                ],
                $workspace,
                $order->id,
            ],
            [
                $order->type,
                $payload['fence'],
                $payload['waiting'],
                $payload['runs'][0]['argv'],
                $payload['runs'][0]['folder'],
                $attempt->refresh()->fence_order_id,
            ],
        );
    }

    public function test_a_settled_attempt_is_not_run_again(): void
    {
        $this->journal->owner()->showDriverArrangements()->chooseActiveAccounts()->idleAgent('Writer', 'writing-helper')
            ->enrollHost('Mac', [base_path()]);
        $opened = $this->journal->openRuntimeOn('Writer', 'Mac', base_path(), driverType: DriverType::Terminal);
        $attempt = $this->journal->openStopAttempt($opened->sessionId);
        $this->journal->refuseHostOrder($this->journal->hostOrdersOn('Mac')[0], HostRefusal::Fenced);

        $this->journal->asSystem(new RunStopConditionsCommand($attempt->id));

        $this->journal->assertResult(1, count($this->journal->hostOrdersOn('Mac')));
    }
}
