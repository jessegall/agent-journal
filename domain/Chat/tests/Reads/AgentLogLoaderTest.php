<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Reads;

use App\Agents\Drivers\Enums\RetriedAction;
use App\Agents\Drivers\Enums\RetryOutcome;
use App\Exceptions\StackTargetRefused;
use App\Models\Drivers\RetryAttempt;
use Carbon\CarbonImmutable;
use Domain\Chat\Data\AgentLogData;
use Domain\Chat\Data\AgentLogInput;
use Domain\Chat\Data\AgentLogLineData;
use Domain\Chat\Enums\AgentLogLineType;
use Domain\Chat\Http\Loaders\AgentLogLoader;
use Domain\Chat\Tests\TestCase;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\Entries\Attributes\TestsRead;
use Tests\Support\RefreshHookDatabase;

/**
 * The chat's Technical details read an agent's starts from the journal's own records, newest first: a refused start
 * shows as failed, with the host's reason and the evidence behind it, in plain words that name no process id, server
 * path or request number; an agent out of sight is refused.
 */
#[TestsRead(AgentLogLoader::class)]
final class AgentLogLoaderTest extends TestCase
{
    use OpensLedgerRuntimes;
    use RefreshHookDatabase;

    private const string REFUSAL = 'Claude Code refused the sign-in of Work (Max)';

    public function test_the_log_lists_a_failed_start_with_its_reason(): void
    {
        $this->journal->idleAgent('Planner')->startSession('Planner', 'Planner');
        $session = $this->journal->sessionCalled('Planner');
        $start = $this->journal->startOfSession($session->id);
        $start->refuse(self::REFUSAL);

        $log = $this->read($this->journal->agentCalled('Planner')->id);
        $shown = $log->starts[0];
        $refused = array_values(array_filter(
            $shown->lines,
            fn (AgentLogLineData $line) => $line->type === AgentLogLineType::StartRefused,
        ));

        $words = implode(' ', array_map(
            fn (AgentLogLineData $line) => "{$line->detail} {$line->evidence}",
            $shown->lines,
        ));

        $this->assertSame(
            [$session->id, 'Failed', true, 1, self::REFUSAL, true, false, false],
            [
                $shown->sessionId,
                $shown->outcome,
                $shown->hasFailed,
                count($refused),
                $refused[0]->reason,
                str_contains((string) $refused[0]->evidence, 'account '),
                str_contains($words, $start->id),
                str_contains($words, $start->directory),
            ],
        );
    }

    public function test_an_agent_the_viewer_cannot_see_is_refused(): void
    {
        $this->expectException(StackTargetRefused::class);

        $this->read('01m8dd0sct689m9bbtqr335rad');
    }

    public function test_the_log_keeps_all_three_retry_lines_and_one_final_failure(): void
    {
        [, $opened] = $this->openRuntime();
        $now = CarbonImmutable::now()->startOfSecond();

        foreach ([
            1,
            2,
            3,
        ] as $retry) {
            $attempt = RetryAttempt::record($opened->runtimeId, RetriedAction::Wake, $retry, 'Host unavailable.', $now);
            $attempt->settle($retry === 3 ? RetryOutcome::GaveUp : RetryOutcome::Failed, 'Docker was unreachable.');
            $now = $attempt->retry_at;
        }

        $lines = collect($this->read($this->agentIdOf($opened))->starts[0]->lines);
        $retrying = $lines->filter(fn (AgentLogLineData $line) => $line->type === AgentLogLineType::Retrying);
        $failure = $lines->sole(fn (AgentLogLineData $line) => $line->type === AgentLogLineType::GaveUp);

        $this->assertCount(3, $retrying);
        $this->assertTrue($retrying->contains(fn (AgentLogLineData $line) => str_contains(
            (string) $line->detail,
            'attempt 2 of 3',
        )));
        $this->assertTrue($failure->isFailure);
        $this->assertSame('Docker was unreachable.', (string) $failure->evidence);
    }

    private function read(string $agent): AgentLogData
    {
        return $this->app->make(AgentLogLoader::class)(AgentLogInput::validateAndCreate(['agent' => $agent]));
    }
}
