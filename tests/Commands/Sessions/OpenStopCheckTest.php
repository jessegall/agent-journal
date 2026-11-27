<?php

declare(strict_types=1);

namespace Tests\Commands\Sessions;

use App\Models\Sessions\SessionPolicy;
use App\Models\Sessions\StopCheck;
use App\Sessions\Commands\OpenStopCheck\OpenStopCheckCommand;
use App\Sessions\Enums\StopCheckStatus;
use App\Sessions\Values\StartPolicy;
use App\Sessions\Values\StopConditions;
use App\Values\StopCondition;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A stop's attempt opens once, however often its stop is asked again; with no stop conditions it passes as it opens
 * and its work is certified.
 */
#[TestsCommand(OpenStopCheckCommand::class)]
final class OpenStopCheckTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_stop_with_conditions_opens_one_waiting_attempt(): void
    {
        $start = $this->withConditions($this->journal->signedStart('Writer', 'writing-helper'));
        $open = new OpenStopCheckCommand($start->agent->id, $start->session->id, 'stop-1');

        $this->journal->runAsStart($start, $open);
        $this->journal->runAsStart($start, $open);

        $attempt = $this->stopCheck();
        $this->assertSame([StopCheckStatus::Pending, false], [$attempt->status, $attempt->isCertified()]);
    }

    public function test_a_stop_without_conditions_passes_and_is_certified_as_it_opens(): void
    {
        $start = $this->journal->signedStart('Writer', 'writing-helper');
        SessionPolicy::create($start->session, StartPolicy::mainOnHost('/workspace'));

        $this->journal->runAsStart($start, new OpenStopCheckCommand($start->agent->id, $start->session->id, 'stop-1'));

        $attempt = $this->stopCheck();
        $this->assertSame([StopCheckStatus::Passed, true], [$attempt->status, $attempt->isCertified()]);
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
