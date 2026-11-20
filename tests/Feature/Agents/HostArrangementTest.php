<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Agents\Commands\EnrollHost;
use App\Agents\Commands\OpenAgentRuntime;
use App\Agents\Enums\ArrangementType;
use App\Agents\Enums\DriverType;
use App\Agents\Exceptions\ArrangementUnknown;
use App\Agents\Exceptions\HostArrangementRefused;
use App\Agents\Exceptions\InstallationNameMissing;
use App\Agents\Models\Agent;
use App\Agents\Models\ProcessStart;
use App\Agents\Support\ArrangementSetting;
use App\Agents\Support\OpenedRuntime;
use App\Bus\Contracts\CommandBus;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * AGENTS_ARRANGEMENT says whether the journal runs agents locally or in containers, and a start on a host of the
 * other arrangement is refused before anything is created (doc 61, decision 1).
 */
final class HostArrangementTest extends TestCase
{
    use CommitsHookRows;
    use RunsTrustedCommands;
    use SendsHostCalls;
    use WithActiveAccount;

    private const string FOLDER = '/work/project';

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'start_tokens',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'driver_turns',
        'accounts',
        'active_accounts',
        'process_starts',
        'links',
        'command_receipts',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->chooseActiveAccounts();
    }

    public function test_by_default_the_journal_is_local_and_a_local_host_starts_as_before(): void
    {
        $this->assertSame(ArrangementType::Local, $this->app->make(ArrangementSetting::class)->arrangement);
        $this->assertNotSame('', $this->openOn(ArrangementType::Local)->runtimeId);
    }

    public function test_a_contained_journal_refuses_a_local_host_and_creates_no_start(): void
    {
        $this->useArrangement(ArrangementType::Contained);
        $starts = ProcessStart::query()->withoutGlobalScopes()->count();

        try {
            $this->openOn(ArrangementType::Local);
            $this->fail('A local host started in a contained journal.');
        } catch (HostArrangementRefused $refusal) {
            $this->assertSame(HostArrangementRefused::localHost()->getMessage(), $refusal->getMessage());
        }

        $this->assertSame($starts, ProcessStart::query()->withoutGlobalScopes()->count());
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

        ArrangementSetting::fromConfig('sideways', 'journal');
    }

    public function test_a_contained_journal_without_an_installation_name_is_refused(): void
    {
        $this->expectExceptionObject(InstallationNameMissing::whenContained());

        ArrangementSetting::fromConfig('contained', '');
    }

    public function test_a_claim_reports_the_host_arrangement_and_one_unlike_its_enrolment_is_refused(): void
    {
        $host = $this->enrolledHost();
        $claim = '/host/claim?limit=1&wait=0&watched_version=0';

        $this->hostCall($host, $claim)->assertOk();
        $this->hostCall($host, $claim.'&arrangement=local')->assertOk();
        $this->hostCall($host, $claim.'&arrangement=contained')
            ->assertStatus(409)
            ->assertJsonPath(
                'message',
                HostArrangementRefused::unlikeEnrollment(ArrangementType::Contained, ArrangementType::Local)->getMessage(),
            );
    }

    private function useArrangement(ArrangementType $arrangement): void
    {
        $this->app->instance(ArrangementSetting::class, ArrangementSetting::fromConfig($arrangement->value, 'journal'));
    }

    private function openOn(ArrangementType $arrangement): OpenedRuntime
    {
        $host = $this->asSystem(new EnrollHost('test host '.Str::random(6), [self::FOLDER], $arrangement));
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser('owner'), new OwnerAuthority('test'));
        $agent = Agent::create('Started agent '.Str::random(6), 'main-agent');

        return $this->app->make(CommandBus::class)->run(new OpenAgentRuntime(
            $agent->id,
            $host->hostId,
            self::FOLDER,
            'claude-code',
            '2.1.323',
            'claude',
            DriverType::Process,
            'claude-opus-5-5',
        ));
    }
}
