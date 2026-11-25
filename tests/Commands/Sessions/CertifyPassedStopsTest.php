<?php

declare(strict_types=1);

namespace Tests\Commands\Sessions;

use App\Commands\Sessions\CertifyPassedStops\CertifyPassedStopsCommand;
use App\Commands\Sessions\RecordStopConditionResults\RecordStopConditionResultsCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Drivers\DriverCatalogue;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Agents\ConversationModeType;
use App\Enums\Drivers\DriverType;
use App\Enums\Sessions\StartOriginType;
use App\Enums\Sessions\StopConditionResultType;
use App\Events\Hooks\HelperCompletionCertified;
use App\Models\Agents\AgentSession;
use App\Models\Sessions\SessionPolicy;
use App\Models\Sessions\SessionRequest;
use App\Models\Sessions\StopCheck;
use App\Support\ActorIdentity;
use App\Support\CommandEntrance;
use App\Support\EngineAccess;
use App\Support\RecordIdentity;
use App\Support\RequestKey;
use App\Support\SystemActor;
use App\Values\ModelSelection;
use App\Values\SelectedDriver;
use App\Values\StartPolicy;
use App\Values\StartRequest;
use App\Values\StopCondition;
use App\Values\StopConditionResultReport;
use App\Values\StopConditions;
use App\Values\TrustedEntryAuthority;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use PhpOption\None;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\AsksTheStopGate;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A stop whose checks passed but that never came back is certified once by the engine.
 */
#[TimeLimit(seconds: 5, reason: 'It starts test agent sessions, opens a runtime and empties the hook tables.')]
final class CertifyPassedStopsTest extends TestCase
{
    use AsksTheStopGate;
    use OpensLedgerRuntimes;
    use RefreshHookDatabase;

    public function test_a_stop_that_never_comes_back_is_certified_once_by_the_engine(): void
    {
        Event::fake([HelperCompletionCertified::class]);
        $start = $this->helperWithConditions();
        $this->startedFor($start);
        $this->stop($start, 'stop-1');
        $this->settle('stop-1', StopConditionResultType::Passed, 'clean');

        $this->certifyPassedStops('pass-1');
        $this->certifyPassedStops('pass-2');
        $this->stop($start, 'stop-1');

        $this->assertNotNull(StopCheck::query()->withoutGlobalScopes()->sole()->certified_at);
        Event::assertDispatchedTimes(HelperCompletionCertified::class, 1);
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

    private function startedFor(TestStart $start): RecordIdentity
    {
        return $this->ownerStart($start->session);
    }

    /**
     * Records that an owner started the session for a helper job, as a helper dispatch does.
     */
    private function ownerStart(AgentSession $session): RecordIdentity
    {
        $work = new RecordIdentity('helpers.helper-job', (string) Str::ulid());
        $request = new StartRequest(
            TestSelections::requestId(),
            $session->agent_id,
            SelectedDriver::resolve(
                'claude-code',
                ModelSelection::named('claude-opus-5-5'),
                null,
                null,
                $this->app->make(DriverCatalogue::class),
            ),
            StartOriginType::OwnerRequest,
            $work,
            null,
            ConversationModeType::New,
            null,
            StartPolicy::withoutProfile(TestSelections::onHost()),
            driverType: DriverType::Headless,
        );
        SessionRequest::create(
            $request,
            TestSelections::pinOf($request),
            ActorIdentity::system(),
            None::create(),
        )->startedAs($session);

        return $work;
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

    /**
     * Runs the engine's sweep of passed stops, as one engine pass does.
     */
    private function certifyPassedStops(string $pass): void
    {
        $this->app->make(CurrentActorSetter::class)->set(new SystemActor(), new TrustedEntryAuthority('engine pass'));
        $this->app->make(EngineAccess::class)->grantMaintenance(CertifyPassedStopsCommand::MAINTENANCE_SCOPE);
        $this->app->make(RequestKey::class)->set($pass);
        $bus = $this->app->make(CommandBus::class);
        $this->app->make(CommandEntrance::class)->through(
            CommandEntry::EngineMaintenance,
            fn () => $bus->run(new CertifyPassedStopsCommand()),
        );
    }
}
