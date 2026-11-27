<?php

declare(strict_types=1);

namespace Tests\Commands\Sessions;

use App\Agents\Drivers\Enums\DriverType;
use App\Hosts\Protocol\HostRefusal;
use App\Models\Sessions\StopCheck;
use App\Models\Sessions\StopConditionResult;
use App\Sessions\Commands\SettleFencedStopCheck\SettleFencedStopCheckCommand;
use App\Sessions\Enums\StopCheckStatus;
use Tests\Support\Agents\TestAgent;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Hosts\TestHostInstruction;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The host's answer to a stop's run_fenced instruction settles its attempt by each condition's result; a refused run leaves
 * it unresolved, so the agent's next stop asks again.
 */
#[TestsCommand(SettleFencedStopCheckCommand::class)]
final class SettleFencedStopCheckTest extends TestCase
{
    use RefreshHookDatabase;

    private StopCheck $attempt;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->showDriverArrangements()->chooseActiveAccounts()->idleAgent('Writer', 'writing-helper')
            ->enrollHost('Mac', [base_path()]);
        $this->journal->withAgent('Writer', fn (TestAgent $writer) => $writer
            ->openRuntime('Mac', base_path(), driverType: DriverType::Terminal));
        $opened = $this->journal->openedRuntimeOf('Writer');
        $this->attempt = $this->journal->openStopAttempt($opened->sessionId);
    }

    public function test_the_answered_results_settle_the_attempt_by_each_condition(): void
    {
        $instruction = $this->journal->hostInstructionsOn('Mac')[0];

        $this->journal->hostInstruction($instruction, fn (TestHostInstruction $instruction) => $instruction
            ->answerWith(['results' => [$this->conditionResult('failed', 'NOTE is not committed')]]));

        $result = StopConditionResult::query()->sole();
        $this->journal->assertResult(
            [StopCheckStatus::Failed, 'NOTE is not committed', 1],
            [$this->attempt->refresh()->status, $result->summary, $result->exit_code],
        );
    }

    public function test_a_passed_run_passes_the_attempt(): void
    {
        $instruction = $this->journal->hostInstructionsOn('Mac')[0];

        $this->journal->hostInstruction($instruction, fn (TestHostInstruction $instruction) => $instruction
            ->answerWith(['results' => [$this->conditionResult('passed', 'clean')]]));

        $this->journal->assertResult(StopCheckStatus::Passed, $this->attempt->refresh()->status);
    }

    public function test_a_refused_run_leaves_the_attempt_unresolved(): void
    {
        $instruction = $this->journal->hostInstructionsOn('Mac')[0];

        $this->journal->hostInstruction($instruction, fn (TestHostInstruction $instruction) => $instruction->refuse(HostRefusal::Fenced));

        $this->journal->assertResult(StopCheckStatus::Unresolved, $this->attempt->refresh()->status);
    }

    /**
     * @return array<string, mixed>
     */
    private function conditionResult(string $status, string $summary): array
    {
        return [
            'status' => $status,
            'started_at' => '2026-11-26T10:00:00Z',
            'ended_at' => '2026-11-26T10:00:01Z',
            'exit_code' => $status === 'passed' ? 0 : 1,
            'signal' => null,
            'summary' => $summary,
            'output' => $summary,
            'truncated' => false,
        ];
    }
}
