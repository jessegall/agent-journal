<?php

declare(strict_types=1);

namespace Tests\Machinery\Hooks;

use App\Bus\Contracts\CommandBus;
use App\Bus\Exceptions\CommandNotRegistered;
use App\Hooks\PruneHookHistory;
use App\Models\Sessions\StopCheck;
use App\Models\Sessions\StopConditionResult;
use App\Processes\Contracts\StopEvidence;
use App\Sessions\Commands\RecordStopConditionResults\RecordStopConditionResultsCommand;
use App\Sessions\Enums\StopCheckStatus;
use App\Sessions\Enums\StopConditionResultType;
use App\Sessions\Exceptions\StopConditionResultsRefused;
use App\Sessions\Values\StopIdentity;
use App\Values\StopCheckReference;
use App\Values\StopConditionResultReport;
use Carbon\CarbonImmutable;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A stop attempt is opened once per session and stop callback; only the host's transport stores its results, once,
 * for the policy, generation and conditions it was asked under; and old raw output is pruned while summaries stay.
 */
#[TimeLimit(seconds: 3, reason: 'It starts a test agent session and empties the hook tables.')]
#[TestsMachinery(StopEvidence::class)]
#[TestsMachinery(PruneHookHistory::class)]
final class StopCheckTest extends TestCase
{
    use RefreshHookDatabase;

    private const string SUMMARY = 'passed in summary';

    private const string DIGEST = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

    private const string HASH = 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';

    public function test_the_host_stores_every_status_and_the_attempt_settles_by_them(): void
    {
        $start = $this->journal->signedStart('Writer', 'writing-helper');
        $statuses = StopConditionResultType::cases();
        $attempt = $this->open($start, 'stop-1', $this->keysOf($statuses));

        $state = $this->journal->asSystem($this->results($attempt, $statuses));

        $this->assertSame(StopCheckStatus::Failed, $state);
        $this->assertSame(
            count($statuses),
            StopConditionResult::query()->where('stop_check_id', $attempt->id)->count(),
        );
        $this->assertNull(StopConditionResult::query()->where('condition_key', 'unknown')->sole()->exit_code);
    }

    public function test_the_same_submission_answers_the_stored_state_and_a_changed_one_conflicts(): void
    {
        $start = $this->journal->signedStart('Writer', 'writing-helper');
        $attempt = $this->open($start, 'stop-1', ['passed']);
        $passing = $this->results($attempt, [StopConditionResultType::Passed]);

        $this->assertSame(StopCheckStatus::Passed, $this->journal->asSystem($passing));
        $this->assertSame(StopCheckStatus::Passed, $this->journal->asSystem($passing));
        $this->assertThrows(
            fn () => $this->journal->asSystem(
                $this->results($attempt, [StopConditionResultType::Failed], ['failed' => 'passed']),
            ),
            StopConditionResultsRefused::class,
        );
    }

    public function test_a_stale_generation_a_changed_digest_or_other_conditions_are_refused(): void
    {
        $start = $this->journal->signedStart('Writer', 'writing-helper');
        $attempt = $this->open($start, 'stop-1', ['passed']);
        $report = $this->notify('passed', StopConditionResultType::Passed);
        $other = $this->notify('other', StopConditionResultType::Passed);

        foreach ([
            new RecordStopConditionResultsCommand('host-1', $attempt->id, self::DIGEST, 2, [$report]),
            new RecordStopConditionResultsCommand('host-1', $attempt->id, str_repeat('c', 64), 1, [$report]),
            new RecordStopConditionResultsCommand('host-1', $attempt->id, self::DIGEST, 1, [$report, $report]),
            new RecordStopConditionResultsCommand('host-1', $attempt->id, self::DIGEST, 1, [$other]),
        ] as $command) {
            $this->assertThrows(fn () => $this->journal->asSystem($command), StopConditionResultsRefused::class);
        }

        $this->assertSame(0, StopConditionResult::query()->count());
    }

    public function test_a_helper_session_cannot_post_its_own_results(): void
    {
        $start = $this->journal->signedStart('Writer', 'writing-helper');
        $attempt = $this->open($start, 'stop-1', ['passed']);
        $start->startRequest($this->app);

        $this->assertThrows(
            fn () => $this->app->make(CommandBus::class)->run(
                $this->results($attempt, [StopConditionResultType::Passed]),
            ),
            CommandNotRegistered::class,
        );
    }

    public function test_the_session_reads_its_attempt_summaries_through_the_evidence(): void
    {
        $start = $this->journal->signedStart('Writer', 'writing-helper');
        $attempt = $this->open($start, 'stop-1', ['failed']);
        $this->journal->asSystem($this->results($attempt, [StopConditionResultType::Failed]));
        $start->startRequest($this->app);

        $result = $this->app->make(StopEvidence::class)->result(new StopCheckReference($attempt->id));

        $this->assertSame(StopCheckStatus::Failed, $result->status);
        $this->assertSame(['failed' => StopConditionResultType::Failed], $result->statuses);
        $this->assertSame(['failed' => 'failed in summary'], $result->summaries);
    }

    public function test_old_raw_output_is_pruned_while_the_summary_stays(): void
    {
        $start = $this->journal->signedStart('Writer', 'writing-helper');
        $attempt = $this->open($start, 'stop-1', ['passed']);
        $this->travelTo(CarbonImmutable::now()->subDays(8));
        $this->journal->asSystem($this->results($attempt, [StopConditionResultType::Passed]));
        $this->travelBack();

        $pruned = $this->app->make(PruneHookHistory::class)->prune();

        $result = StopConditionResult::query()->sole();
        $this->assertSame(1, $pruned->stopOutputs);
        $this->assertNull($result->output);
        $this->assertSame(self::SUMMARY, $result->summary);
    }

    private function open(TestStart $start, string $stopId, array $conditions = ['passed']): StopCheck
    {
        $stop = new StopIdentity($start->agent->id, $start->session->id, $stopId);

        return StopCheck::create($stop, self::DIGEST, 1, array_fill_keys($conditions, self::HASH));
    }

    /**
     * @param  list<StopConditionResultType>  $statuses
     * @param  array<string, string>  $renamed  status value => condition key it is reported under
     */
    private function results(
        StopCheck $attempt,
        array $statuses,
        array $renamed = [],
    ): RecordStopConditionResultsCommand {
        return new RecordStopConditionResultsCommand('host-1', $attempt->id, self::DIGEST, 1, array_map(
            fn (StopConditionResultType $status) => $this->notify($renamed[$status->value] ?? $status->value, $status),
            $statuses,
        ));
    }

    private function notify(string $conditionKey, StopConditionResultType $status): StopConditionResultReport
    {
        $exitCode = match ($status) {
            StopConditionResultType::Passed => 0,
            StopConditionResultType::Unknown => null,
            default => 1,
        };

        return new StopConditionResultReport(
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
     * @param  list<StopConditionResultType>  $statuses
     * @return list<string>
     */
    private function keysOf(array $statuses): array
    {
        return array_map(fn (StopConditionResultType $status) => $status->value, $statuses);
    }
}
