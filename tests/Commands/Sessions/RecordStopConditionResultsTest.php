<?php

declare(strict_types=1);

namespace Tests\Commands\Sessions;

use App\Commands\Sessions\RecordStopConditionResults\RecordStopConditionResultsCommand;
use App\Enums\Hooks\AnswerType;
use App\Enums\Sessions\StopCheckStatus;
use App\Enums\Sessions\StopConditionResultType;
use App\Models\Sessions\SessionPolicy;
use App\Models\Sessions\StopCheck;
use App\Values\AgentText;
use App\Values\StartPolicy;
use App\Values\StopCondition;
use App\Values\StopConditionResultReport;
use App\Values\StopConditions;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\AsksTheStopGate;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestText;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A stop of a session with stop conditions opens its attempt and ends the turn with the job open while the host's
 * checks run; a failed result refuses the stop with its summary and a passed one allows it; a session without
 * conditions stops at once on a passed attempt. The host's run_fenced runner is proven by the Go tests of hostapi.
 */
#[TimeLimit(seconds: 3, reason: 'It starts a test agent session and empties the hook tables.')]
#[TestsCommand(RecordStopConditionResultsCommand::class)]
final class RecordStopConditionResultsTest extends TestCase
{
    use AsksTheStopGate;
    use RefreshHookDatabase;

    private const string DIRTY_WORKTREE = 'clean-worktree (failed): NOTE is not committed';

    public function test_a_stop_with_conditions_opens_its_attempt_and_ends_the_turn_while_the_checks_run(): void
    {
        $start = $this->helperWithConditions();

        $decision = $this->stop($start, 'stop-1');
        $again = $this->stop($start, 'stop-1');

        $attempt = StopCheck::query()->withoutGlobalScopes()->sole();
        $this->assertSame(AnswerType::Allow, $this->typeOf($decision));
        $this->assertSame([TestText::words(AgentText::of('core.stop.checks_running'))], $this->messagesOf($decision));
        $this->assertSame(AnswerType::Allow, $this->typeOf($again));
        $this->assertSame(
            new StopConditions([StopCondition::cleanWorktree()])->definitionHashes(),
            $attempt->condition_hashes,
        );
    }

    public function test_a_failed_result_refuses_the_stop_with_its_summary_and_a_passed_one_allows_it(): void
    {
        $start = $this->helperWithConditions();
        $this->stop($start, 'stop-1');
        $this->settle('stop-1', StopConditionResultType::Failed, 'NOTE is not committed');
        $this->stop($start, 'stop-2');
        $this->settle('stop-2', StopConditionResultType::Passed, 'clean');

        $refused = $this->stop($start, 'stop-1');
        $allowed = $this->stop($start, 'stop-2');

        $this->assertSame(AnswerType::Deny, $this->typeOf($refused));
        $this->assertStringContainsString(self::DIRTY_WORKTREE, TestText::words($refused->decision->refusalReason()));
        $this->assertSame(AnswerType::Allow, $this->typeOf($allowed));
        $this->assertSame([], $this->messagesOf($allowed));
    }

    public function test_a_session_without_stop_conditions_stops_at_once_on_a_passed_attempt(): void
    {
        $unfrozen = $this->journal->signedStart('Test agent', 'writing-helper');
        $empty = $this->journal->signedStart('Test agent 2', 'writing-helper');
        SessionPolicy::create($empty->session, StartPolicy::mainOnHost('/workspace'));

        $this->assertSame(AnswerType::Allow, $this->typeOf($this->stop($unfrozen, 'stop-1')));
        $this->assertSame(AnswerType::Allow, $this->typeOf($this->stop($empty, 'stop-1')));
        $this->assertSame(
            StopCheckStatus::Passed,
            StopCheck::query()->withoutGlobalScopes()->sole()->status,
        );
    }

    private function helperWithConditions(): TestStart
    {
        $start = $this->journal->signedStart('Test agent 3', 'writing-helper');
        $policy = StartPolicy::mainOnHost('/workspace');
        SessionPolicy::create($start->session, new StartPolicy(
            $policy->access,
            new StopConditions([StopCondition::cleanWorktree()]),
            $policy->execution,
            'writing-helper',
            1,
            null,
        ));

        return $start;
    }

    private function settle(string $stopId, StopConditionResultType $status, string $summary): void
    {
        $attempt = StopCheck::query()->withoutGlobalScopes()->where('stop_id', $stopId)->sole();
        $condition = StopCondition::cleanWorktree();

        $this->journal->asSystem(new RecordStopConditionResultsCommand(
            'host-1',
            $attempt->id,
            $attempt->policy_digest,
            0,
            [
                new StopConditionResultReport(
                    $condition->key,
                    $condition->definitionHash(),
                    $status,
                    '2026-11-20T01:00:00Z',
                    '2026-11-20T01:00:01Z',
                    $status === StopConditionResultType::Passed ? 0 : 1,
                    null,
                    $summary,
                    null,
                    false,
                ),
            ]
        ));
    }
}
