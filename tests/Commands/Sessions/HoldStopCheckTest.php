<?php

declare(strict_types=1);

namespace Tests\Commands\Sessions;

use App\Events\Hooks\StopCheckHeld;
use App\Models\Sessions\SessionPolicy;
use App\Models\Sessions\StopCheck;
use App\Sessions\Commands\HoldStopCheck\HoldStopCheckCommand;
use App\Sessions\Enums\StopCheckStatus;
use App\Sessions\Values\StartPolicy;
use App\Sessions\Values\StopConditions;
use App\Values\StopCondition;
use Illuminate\Support\Facades\Event;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A stop the profile's stop script held is kept as a failed attempt; a session that no owner started tells no one.
 */
#[TestsCommand(HoldStopCheckCommand::class)]
final class HoldStopCheckTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_held_stop_is_a_failed_attempt_and_a_session_of_its_own_notifies_no_owner(): void
    {
        Event::fake([StopCheckHeld::class]);
        $start = $this->withConditions($this->journal->signedStart('Writer', 'writing-helper'));

        $this->journal->runAsStart(
            $start,
            new HoldStopCheckCommand($start->agent->id, $start->session->id, 'stop-1', 'core.stop.definitions_changed'),
        );

        $this->assertSame(StopCheckStatus::Failed, $this->stopCheck()->status);
        Event::assertNotDispatched(StopCheckHeld::class);
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
