<?php

declare(strict_types=1);

namespace Tests\Commands\Sessions;

use App\Models\Sessions\SessionPolicy;
use App\Models\Sessions\StopCheck;
use App\Sessions\Commands\CertifyStopCheck\CertifyStopCheckCommand;
use App\Sessions\Commands\OpenStopCheck\OpenStopCheckCommand;
use App\Sessions\Commands\RecordStopConditionResults\RecordStopConditionResultsCommand;
use App\Sessions\Enums\StopConditionResultType;
use App\Sessions\Values\StartPolicy;
use App\Sessions\Values\StopConditions;
use App\Values\StopCondition;
use App\Values\StopConditionResultReport;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The work of a stop whose attempt passed is certified once, however often it is asked.
 */
#[TestsCommand(CertifyStopCheckCommand::class)]
final class CertifyStopCheckTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_passed_stop_is_certified(): void
    {
        $start = $this->withConditions($this->journal->signedStart('Writer', 'writing-helper'));
        $this->journal->runAsStart($start, new OpenStopCheckCommand($start->agent->id, $start->session->id, 'stop-1'));
        $condition = StopCondition::cleanWorktree();
        $attempt = $this->stopCheck();
        $this->journal->asSystem(new RecordStopConditionResultsCommand('host-1', $attempt->id, $attempt->policy_digest, 0, [
            new StopConditionResultReport(
                $condition->key,
                $condition->definitionHash(),
                StopConditionResultType::Passed,
                '2026-11-20T01:00:00Z',
                '2026-11-20T01:00:01Z',
                0,
                null,
                '',
                null,
                false,
            ),
        ]));
        $certify = new CertifyStopCheckCommand($start->agent->id, $start->session->id, 'stop-1');

        $this->journal->runAsStart($start, $certify);
        $this->journal->runAsStart($start, $certify);

        $this->assertTrue($this->stopCheck()->isCertified());
    }

    private function withConditions(TestStart $start): TestStart
    {
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

    private function stopCheck(): StopCheck
    {
        return StopCheck::query()->withoutGlobalScopes()->sole();
    }
}
