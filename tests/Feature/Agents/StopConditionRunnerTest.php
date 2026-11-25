<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Commands\Sessions\RecordStopConditionResults\RecordStopConditionResultsCommand;
use App\Enums\Hooks\AnswerType;
use App\Enums\Sessions\StopCheckState;
use App\Enums\Sessions\StopConditionResultType;
use App\Models\Sessions\SessionPolicy;
use App\Models\Sessions\SessionProcess;
use App\Models\Sessions\StopCheck;
use App\Support\RecordIdentity;
use App\Values\AgentText;
use App\Values\SelectedAccount;
use App\Values\StartPolicy;
use App\Values\StopCondition;
use App\Values\StopConditionResultReport;
use App\Values\StopConditions;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\AsksTheStopGate;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\Support\TestText;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A stop of a session with stop conditions opens its attempt and ends the turn with the job open while the host's
 * checks run; the host reads the frozen conditions of its own sessions; a failed result refuses the stop with its
 * summary and a passed one allows it; a session without conditions stops at once on a passed attempt. The host's
 * runner itself is proven by tools/journal-agent/host/stop_conditions_test.go.
 */
#[TimeLimit(seconds: 3, reason: 'It starts a test agent session and empties the hook tables.')]
final class StopConditionRunnerTest extends TestCase
{
    use AsksTheStopGate;
    use RefreshHookDatabase;
    use RunsTrustedCommands;
    use SendsHostCalls;

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

    public function test_the_host_reads_the_frozen_conditions_of_its_own_sessions(): void
    {
        $start = $this->helperWithConditions();
        $this->stop($start, 'stop-1');
        $host = $this->enrolledHost();
        $this->claimOn($start, $host->hostId);

        $response = $this->hostRead($host, '/host/stop-attempts');

        $condition = StopCondition::cleanWorktree();
        $response->assertOk()
            ->assertJsonPath('attempts.0.session_id', $start->session->id)
            ->assertJsonPath('attempts.0.attempt_seconds', StopConditions::DEFAULT_ATTEMPT_SECONDS)
            ->assertJsonPath('attempts.0.conditions.0.key', StopCondition::CLEAN_WORKTREE)
            ->assertJsonPath('attempts.0.conditions.0.executable', $condition->executable)
            ->assertJsonPath('attempts.0.conditions.0.arguments', $condition->arguments)
            ->assertJsonPath('attempts.0.conditions.0.definition_hash', $condition->definitionHash());
        $this->hostRead($this->enrolledHost(), '/host/stop-attempts')->assertOk()->assertExactJson(['attempts' => []]);
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
        $unfrozen = TestStart::start('writing-helper');
        $empty = TestStart::start('writing-helper');
        SessionPolicy::create($empty->session, StartPolicy::mainOnHost('/workspace'));

        $this->assertSame(AnswerType::Allow, $this->typeOf($this->stop($unfrozen, 'stop-1')));
        $this->assertSame(AnswerType::Allow, $this->typeOf($this->stop($empty, 'stop-1')));
        $this->assertSame(
            StopCheckState::Passed,
            StopCheck::query()->withoutGlobalScopes()->sole()->state,
        );
    }

    private function helperWithConditions(): TestStart
    {
        $start = TestStart::start('writing-helper');
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

        $this->asSystem(new RecordStopConditionResultsCommand('host-1', $attempt->id, $attempt->policy_digest, 0, [
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
        ]));
    }

    private function claimOn(TestStart $start, string $hostId): void
    {
        $account = new SelectedAccount(
            new RecordIdentity('profiles.account', (string) Str::ulid()),
            'codex',
            '/accounts/a',
            1,
        );
        SessionProcess::create($start->session, $account);
        SessionProcess::query()->supervised()->where('session_id', $start->session->id)->sole()->claimOn($hostId);
    }
}
