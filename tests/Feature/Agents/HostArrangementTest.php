<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Commands\Agents\OpenAgentRuntime\OpenAgentRuntimeCommand;
use App\Commands\Projects\EnrollHost\EnrollHostCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Hosts\DockerImageVerifier;
use App\Enums\Drivers\DriverType;
use App\Enums\Projects\ArrangementType;
use App\Exceptions\ArrangementUnknown;
use App\Exceptions\DriverNotContainable;
use App\Exceptions\HostArrangementRefused;
use App\Exceptions\InstallationNameMissing;
use App\Models\Agents\Agent;
use App\Models\Sessions\SessionProcess;
use App\Support\ActorContext;
use App\Support\ArrangementSetting;
use App\Support\Capabilities\CodexHeadlessCapabilities;
use App\Support\OpenedRuntime;
use App\Values\OwnerAuthority;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\CountingImageVerifier;
use Tests\Support\CommitsHookRows;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * AGENTS_ARRANGEMENT says whether the journal runs agents locally or in containers, and a start on a host of the
 * other arrangement is refused before anything is created.
 */
final class HostArrangementTest extends TestCase
{
    use CommitsHookRows;
    use WithActiveAccount;

    private const string FOLDER = '/work/project';

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'driver_turns',
        'accounts',
        'active_accounts',
        'session_processes',
        'links',
        'command_receipts',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->chooseActiveAccounts();
        $this->app->instance(DockerImageVerifier::class, new CountingImageVerifier());
    }

    public function test_by_default_the_journal_is_local_and_a_local_host_starts_as_before(): void
    {
        $this->assertSame(ArrangementType::Local, $this->app->make(ArrangementSetting::class)->arrangement);
        $this->assertNotSame('', $this->openOn(ArrangementType::Local)->runtimeId);
    }

    public function test_a_contained_journal_refuses_a_local_host_and_creates_no_start(): void
    {
        $this->useArrangement(ArrangementType::Contained);
        $starts = SessionProcess::query()->withoutGlobalScopes()->count();

        try {
            $this->openOn(ArrangementType::Local);
            $this->fail('A local host started in a contained journal.');
        } catch (HostArrangementRefused $refusal) {
            $this->assertSame(HostArrangementRefused::localHost()->getMessage(), $refusal->getMessage());
        }

        $this->assertSame($starts, SessionProcess::query()->withoutGlobalScopes()->count());
    }

    public function test_a_contained_journal_starts_on_a_contained_host(): void
    {
        $this->useArrangement(ArrangementType::Contained);

        $this->assertNotSame('', $this->openOn(ArrangementType::Contained)->runtimeId);
    }

    public function test_a_local_journal_refuses_a_contained_host(): void
    {
        $this->expectExceptionObject(HostArrangementRefused::containedHost());

        $this->openOn(ArrangementType::Contained);
    }

    public function test_an_unknown_arrangement_is_refused_by_name(): void
    {
        $this->expectExceptionObject(ArrangementUnknown::for('sideways'));

        ArrangementSetting::fromConfig('sideways', 'journal', '{}');
    }

    public function test_a_contained_journal_without_an_installation_name_is_refused(): void
    {
        $this->expectExceptionObject(InstallationNameMissing::whenContained());

        ArrangementSetting::fromConfig('contained', '', '{}');
    }

    public function test_a_claim_reports_the_host_arrangement_and_one_unlike_its_enrolment_is_refused(): void
    {
        $host = $this->journal->enrolledHost();
        $claim = '/host/claim?limit=1&wait=0&watched_version=0';

        $this->journal->hostCall($host, 'POST', $claim)->assertOk();
        $this->journal->hostCall($host, 'POST', $claim.'&arrangement=local')->assertOk();
        $this->journal->hostCall($host, 'POST', $claim.'&arrangement=contained')
            ->assertStatus(409)
            ->assertJsonPath(
                'message',
                HostArrangementRefused::unlikeEnrollment(
                    ArrangementType::Contained,
                    ArrangementType::Local,
                )->getMessage(),
            );
    }

    public function test_a_contained_codex_start_is_refused_whatever_its_sign_in_and_creates_no_start(): void
    {
        $this->useArrangement(ArrangementType::Contained);

        try {
            $this->openOn(ArrangementType::Contained, 'codex');
            $this->fail('a contained Codex start was not refused');
        } catch (DriverNotContainable $refusal) {
            $this->assertSame(CodexHeadlessCapabilities::NOT_CONTAINABLE, $refusal->getMessage());
        }

        $this->assertSame(0, SessionProcess::query()->count());
        $this->assertNotSame('', $this->openOn(ArrangementType::Contained)->runtimeId);
    }

    public function test_a_local_codex_start_is_not_refused_by_the_container_check(): void
    {
        $this->assertNotSame('', $this->openOn(ArrangementType::Local, 'codex')->runtimeId);
    }

    private function useArrangement(ArrangementType $arrangement): void
    {
        $this->app->instance(
            ArrangementSetting::class,
            ArrangementSetting::fromConfig($arrangement->value, 'journal', '{}'),
        );
    }

    private function openOn(ArrangementType $arrangement, string $driver = 'claude-code'): OpenedRuntime
    {
        $host = $this->journal->asSystem(
            new EnrollHostCommand('test host '.Str::random(6), [self::FOLDER], $arrangement),
        );
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser('owner'), new OwnerAuthority('test'));
        $agent = Agent::create('Started agent '.Str::random(6), 'main-agent', $this->localProject());
        [$build, $profile, $model] = $driver === 'codex'
            ? ['0.165.0', 'codex', 'gpt-5.5']
            : ['2.1.323', 'claude', 'claude-opus-5-5'];

        return $this->app->make(CommandBus::class)->run(new OpenAgentRuntimeCommand(
            $agent->id,
            $host->hostId,
            self::FOLDER,
            $driver,
            $build,
            $profile,
            DriverType::Headless,
            $model,
        ));
    }
}
