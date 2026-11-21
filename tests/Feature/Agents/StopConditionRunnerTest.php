<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Agents\Models\ProcessStart;
use App\Agents\Models\SessionPolicy;
use App\Agents\Values\SelectedAccount;
use App\Agents\Values\StartPolicy;
use App\Agents\Values\StopCondition;
use App\Agents\Values\StopConditions;
use App\Hooks\Commands\RecordStopResults;
use App\Hooks\Decisions\Decision;
use App\Hooks\Enums\AnswerType;
use App\Hooks\Enums\StopAttemptState;
use App\Hooks\Enums\StopResultType;
use App\Hooks\Inputs\HookIdentity;
use App\Hooks\Models\StopAttempt;
use App\Hooks\States\Contracts\StopConditionGate;
use App\Hooks\Support\StopAttemptGate;
use App\Hooks\Values\StopResultReport;
use App\Records\Support\RecordIdentity;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
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
    use RefreshHookDatabase;
    use RunsTrustedCommands;
    use SendsHostCalls;

    public function test_a_stop_with_conditions_opens_its_attempt_and_ends_the_turn_while_the_checks_run(): void
    {
        $start = $this->helperWithConditions();

        $decision = $this->stop($start, 'stop-1');
        $again = $this->stop($start, 'stop-1');

        $attempt = StopAttempt::query()->withoutGlobalScopes()->sole();
        $this->assertSame(AnswerType::Allow, $decision->answerType());
        $this->assertSame([StopAttemptGate::CHECKS_RUNNING], $decision->messages);
        $this->assertSame(AnswerType::Allow, $again->answerType());
        $this->assertSame(
            StopConditions::make([StopCondition::cleanWorktree()])->definitionHashes(),
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
        $this->settle('stop-1', StopResultType::Failed, 'NOTE is not committed');
        $this->stop($start, 'stop-2');
        $this->settle('stop-2', StopResultType::Passed, 'clean');

        $refused = $this->stop($start, 'stop-1');
        $allowed = $this->stop($start, 'stop-2');

        $this->assertSame(AnswerType::Deny, $refused->answerType());
        $this->assertStringContainsString('clean-worktree (failed): NOTE is not committed', $refused->refusalReason());
        $this->assertSame(AnswerType::Allow, $allowed->answerType());
        $this->assertSame([], $allowed->messages);
    }

    public function test_a_session_without_stop_conditions_stops_at_once_on_a_passed_attempt(): void
    {
        $unfrozen = TestStart::start('writing-helper');
        $empty = TestStart::start('writing-helper');
        SessionPolicy::create($empty->session, StartPolicy::mainOnHost('/workspace'));

        $this->assertSame(AnswerType::Allow, $this->stop($unfrozen, 'stop-1')->answerType());
        $this->assertSame(AnswerType::Allow, $this->stop($empty, 'stop-1')->answerType());
        $this->assertSame(
            StopAttemptState::Passed,
            StopAttempt::query()->withoutGlobalScopes()->sole()->state,
        );
    }

    private function helperWithConditions(): TestStart
    {
        $start = TestStart::start('writing-helper');
        $policy = StartPolicy::mainOnHost('/workspace');
        SessionPolicy::create($start->session, new StartPolicy(
            $policy->access,
            StopConditions::make([StopCondition::cleanWorktree()]),
            $policy->execution,
            'writing-helper',
            1,
            null,
        ));

        return $start;
    }

    private function stop(TestStart $start, string $stopId): Decision
    {
        $hook = new HookIdentity($start->agent->id, $start->session->id, $stopId, 'digest');
        $start->startRequest($this->app);

        return $this->app->make(StopConditionGate::class)->answer($hook);
    }

    private function settle(string $stopId, StopResultType $status, string $summary): void
    {
        $attempt = StopAttempt::query()->withoutGlobalScopes()->where('stop_id', $stopId)->sole();
        $condition = StopCondition::cleanWorktree();

        $this->asSystem(new RecordStopResults('host-1', $attempt->id, $attempt->policy_digest, 0, [
            new StopResultReport(
                $condition->key,
                $condition->definitionHash(),
                $status,
                '2026-11-20T01:00:00Z',
                '2026-11-20T01:00:01Z',
                $status === StopResultType::Passed ? 0 : 1,
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
        ProcessStart::create($start->session, $account);
        ProcessStart::supervised()->where('session_id', $start->session->id)->sole()->claimOn($hostId);
    }
}
