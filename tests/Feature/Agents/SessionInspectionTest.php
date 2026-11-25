<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Commands\Sessions\RecordStopConditionResults\RecordStopConditionResultsCommand;
use App\Contracts\Sessions\ProfileResolver;
use App\Enums\Agents\ExecutionModeType;
use App\Enums\Sessions\StopConditionResultType;
use App\Models\Sessions\SessionPolicy;
use App\Models\Sessions\StopCheck;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\Readers\SessionInspections;
use App\Support\States\Contracts\StopConditionGate;
use App\Values\ProfileKey;
use App\Values\SettledStopChecks;
use App\Values\StartPolicy;
use App\Values\StopCondition;
use App\Values\StopConditionResultLine;
use App\Values\StopConditionResultReport;
use App\Values\StopConditions;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Inspecting a writer session shows what it runs under: its frozen profile revision, execution mode and
 * wall budget, its stop conditions by label and the results of its last stop, with the guidance and never the output.
 */
#[TimeLimit(seconds: 4, reason: 'It starts a test agent session and settles a stop attempt.')]
final class SessionInspectionTest extends TestCase
{
    use RefreshHookDatabase;

    private const string CONFIGURATION_HASH = 'c0ffee00c0ffee00c0ffee00c0ffee00c0ffee00c0ffee00c0ffee00c0ffee00';

    public function test_a_writer_session_shows_its_frozen_policy_and_its_last_stop(): void
    {
        $writer = TestStart::start('writing-helper');
        $policy = StartPolicy::mainOnHost('/workspace');
        $revision = $this->app->make(ProfileResolver::class)->snapshotFor(ProfileKey::from('writing-helper'))->revision;
        SessionPolicy::create($writer->session, new StartPolicy(
            $policy->access,
            new StopConditions([StopCondition::cleanWorktree()]),
            $policy->execution,
            'writing-helper',
            $revision,
            self::CONFIGURATION_HASH,
        ));
        $this->failStop($writer);

        $inspection = $this->app->make(SessionInspections::class)->of($writer->session->id);

        $this->assertSame(['writing-helper', $revision, self::CONFIGURATION_HASH], [
            $inspection->profileKey,
            $inspection->profileRevision,
            $inspection->configurationHash,
        ]);
        $this->assertSame(ExecutionModeType::ProtectedHost, $inspection->executionMode);
        $this->assertSame(6 * 3600, $inspection->wallSeconds);
        $this->assertSame([StopCondition::cleanWorktree()->label], $inspection->stopConditions);
        $this->assertEquals([new StopConditionResultLine(
            StopCondition::cleanWorktree()->label,
            StopConditionResultType::Failed,
            1000,
            1,
            null,
            false,
            'Commit or remove the changed files.',
        )], $inspection->lastStop);
    }

    public function test_a_session_without_a_stop_shows_no_results(): void
    {
        $session = TestStart::start('writing-helper')->session;
        SessionPolicy::create($session, StartPolicy::mainOnHost('/workspace'));

        $this->assertSame([], $this->app->make(SessionInspections::class)->of($session->id)->lastStop);
    }

    private function failStop(TestStart $writer): void
    {
        $writer->startRequest($this->app);
        $hook = new HookIdentity($writer->agent->id, $writer->session->id, 'stop-1', 'digest');
        $this->app->make(StopConditionGate::class)->answer($hook, new SettledStopChecks([]));
        $attempt = StopCheck::query()->withoutGlobalScopes()->where('stop_id', 'stop-1')->sole();
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
                    StopConditionResultType::Failed,
                    '2026-11-20T01:00:00Z',
                    '2026-11-20T01:00:01Z',
                    1,
                    null,
                    'Commit or remove the changed files.',
                    'secret raw output',
                    false,
                ),
            ]
        ));
    }
}
