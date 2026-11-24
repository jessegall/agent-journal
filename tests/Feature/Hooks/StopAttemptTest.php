<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Commands\Starts\RecordStopResults\RecordStopResultsCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Processes\StopEvidence;
use App\Enums\StopAttemptState;
use App\Enums\StopResultType;
use App\Exceptions\CommandNotRegistered;
use App\Exceptions\StopResultsRefused;
use App\Models\Starts\StopAttempt;
use App\Models\Starts\StopResult;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\PruneHookHistory;
use App\Values\StopAttemptReference;
use App\Values\StopResultReport;
use Carbon\CarbonImmutable;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A stop attempt is opened once per session and stop callback; only the host's transport stores its results, once,
 * for the policy, generation and conditions it was asked under; and old raw output is pruned while summaries stay.
 */
#[TimeLimit(seconds: 3, reason: 'It starts a test agent session and empties the hook tables.')]
final class StopAttemptTest extends TestCase
{
    use RefreshHookDatabase;
    use RunsTrustedCommands;
    use SendsHostCalls;

    private const string SUMMARY = 'passed in summary';

    private const string DIGEST = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

    private const string HASH = 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';

    public function test_an_attempt_is_opened_once_per_session_and_stop_callback(): void
    {
        $start = TestStart::start('writing-helper');

        $first = $this->open($start, 'stop-1');
        $retried = $this->open($start, 'stop-1');
        $next = $this->open($start, 'stop-2');

        $this->assertSame($first->id, $retried->id);
        $this->assertNotSame($first->id, $next->id);
        $this->assertSame(StopAttemptState::Pending, $first->state);
    }

    public function test_the_host_stores_every_status_and_the_attempt_settles_by_them(): void
    {
        $start = TestStart::start('writing-helper');
        $statuses = StopResultType::cases();
        $attempt = $this->open($start, 'stop-1', $this->keysOf($statuses));

        $state = $this->asSystem($this->results($attempt, $statuses));

        $this->assertSame(StopAttemptState::Failed, $state);
        $this->assertSame(count($statuses), StopResult::query()->where('stop_attempt_id', $attempt->id)->count());
        $this->assertNull(StopResult::query()->where('condition_key', 'unknown')->sole()->exit_code);
    }

    public function test_the_same_submission_answers_the_stored_state_and_a_changed_one_conflicts(): void
    {
        $start = TestStart::start('writing-helper');
        $attempt = $this->open($start, 'stop-1', ['passed']);
        $passing = $this->results($attempt, [StopResultType::Passed]);

        $this->assertSame(StopAttemptState::Passed, $this->asSystem($passing));
        $this->assertSame(StopAttemptState::Passed, $this->asSystem($passing));
        $this->assertThrows(
            fn () => $this->asSystem($this->results($attempt, [StopResultType::Failed], ['failed' => 'passed'])),
            StopResultsRefused::class,
        );
    }

    public function test_a_stale_generation_a_changed_digest_or_other_conditions_are_refused(): void
    {
        $start = TestStart::start('writing-helper');
        $attempt = $this->open($start, 'stop-1', ['passed']);
        $report = $this->notify('passed', StopResultType::Passed);
        $other = $this->notify('other', StopResultType::Passed);

        foreach ([
            new RecordStopResultsCommand('host-1', $attempt->id, self::DIGEST, 2, [$report]),
            new RecordStopResultsCommand('host-1', $attempt->id, str_repeat('c', 64), 1, [$report]),
            new RecordStopResultsCommand('host-1', $attempt->id, self::DIGEST, 1, [$report, $report]),
            new RecordStopResultsCommand('host-1', $attempt->id, self::DIGEST, 1, [$other]),
        ] as $command) {
            $this->assertThrows(fn () => $this->asSystem($command), StopResultsRefused::class);
        }

        $this->assertSame(0, StopResult::query()->count());
    }

    public function test_a_helper_session_cannot_post_its_own_results(): void
    {
        $start = TestStart::start('writing-helper');
        $attempt = $this->open($start, 'stop-1', ['passed']);
        $start->startRequest($this->app);

        $this->assertThrows(
            fn () => $this->app->make(CommandBus::class)->run($this->results($attempt, [StopResultType::Passed])),
            CommandNotRegistered::class,
        );
    }

    public function test_the_session_reads_its_attempt_summaries_through_the_evidence(): void
    {
        $start = TestStart::start('writing-helper');
        $attempt = $this->open($start, 'stop-1', ['failed']);
        $this->asSystem($this->results($attempt, [StopResultType::Failed]));
        $start->startRequest($this->app);

        $result = $this->app->make(StopEvidence::class)->result(new StopAttemptReference($attempt->id));

        $this->assertSame(StopAttemptState::Failed, $result->state);
        $this->assertSame(['failed' => StopResultType::Failed], $result->statuses);
        $this->assertSame(['failed' => 'failed in summary'], $result->summaries);
    }

    public function test_old_raw_output_is_pruned_while_the_summary_stays(): void
    {
        $start = TestStart::start('writing-helper');
        $attempt = $this->open($start, 'stop-1', ['passed']);
        $this->travelTo(CarbonImmutable::now()->subDays(8));
        $this->asSystem($this->results($attempt, [StopResultType::Passed]));
        $this->travelBack();

        $pruned = $this->app->make(PruneHookHistory::class)->prune();

        $result = StopResult::query()->sole();
        $this->assertSame(1, $pruned->stopOutputs);
        $this->assertNull($result->output);
        $this->assertSame(self::SUMMARY, $result->summary);
    }

    public function test_the_host_route_takes_the_results_and_answers_the_settled_state(): void
    {
        $start = TestStart::start('writing-helper');
        $attempt = $this->open($start, 'stop-1', ['passed']);
        $target = sprintf('/host/stop-attempts/%s/results', $attempt->id);

        $response = $this->hostCall($this->enrolledHost(), $target, [
            'policy_digest' => self::DIGEST,
            'workspace_generation' => 1,
            'results' => [[
                'condition_key' => 'passed',
                'definition_hash' => self::HASH,
                'status' => 'passed',
                'started_at' => '2026-11-20T01:00:00Z',
                'ended_at' => '2026-11-20T01:00:02Z',
                'exit_code' => 0,
                'signal' => null,
                'summary' => 'clean',
                'output' => null,
                'truncated' => false,
            ]],
        ]);

        $response->assertOk()->assertExactJson(['state' => 'passed']);
        $this->assertSame('clean', StopResult::query()->sole()->summary);
    }

    /**
     * @param  list<string>  $conditions
     */
    private function open(TestStart $start, string $stopId, array $conditions = ['passed']): StopAttempt
    {
        $hook = new HookIdentity($start->agent->id, $start->session->id, $stopId, 'digest');

        return StopAttempt::openFor($hook, self::DIGEST, 1, array_fill_keys($conditions, self::HASH));
    }

    /**
     * @param  list<StopResultType>  $statuses
     * @param  array<string, string>  $renamed  status value => condition key it is reported under
     */
    private function results(StopAttempt $attempt, array $statuses, array $renamed = []): RecordStopResultsCommand
    {
        return new RecordStopResultsCommand('host-1', $attempt->id, self::DIGEST, 1, array_map(
            fn (StopResultType $status) => $this->notify($renamed[$status->value] ?? $status->value, $status),
            $statuses,
        ));
    }

    private function notify(string $conditionKey, StopResultType $status): StopResultReport
    {
        $exitCode = match ($status) {
            StopResultType::Passed => 0,
            StopResultType::Unknown => null,
            default => 1,
        };

        return new StopResultReport(
            $conditionKey,
            self::HASH,
            $status,
            CarbonImmutable::now()->toIso8601ZuluString('microsecond'),
            CarbonImmutable::now()->toIso8601ZuluString('microsecond'),
            $exitCode,
            null,
            sprintf('%s in summary', $status->value),
            'raw output',
            false,
        );
    }

    /**
     * @param  list<StopResultType>  $statuses
     * @return list<string>
     */
    private function keysOf(array $statuses): array
    {
        return array_map(fn (StopResultType $status) => $status->value, $statuses);
    }
}
