<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Contracts\Drivers\DriverCatalogue;
use App\Contracts\Sessions\StartPreflight;
use App\Enums\ArrangementType;
use App\Enums\DriverType;
use App\Enums\ModelTier;
use App\Enums\ExecutionModeType;
use App\Enums\StartPreflightRefusal;
use App\Exceptions\StartPreflightRefused;
use App\Models\Agents\AgentRuntime;
use App\Models\Projects\Host;
use App\Support\DefaultDrivers;
use App\Support\HostDescriptorEnrollment;
use App\Values\EnrolledDescriptor;
use App\Values\HostDescriptor;
use App\Values\ProfileDefaults;
use App\Values\StartProposal;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * The server answers whether a driver, driver type and placement can start before anything stops or is reserved: the
 * profile's pinned driver, contained Codex and the combinations the host declared each refuse with their reason.
 */
final class StartPreflightTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['hosts', 'agent_runtimes'];

    private const string BUILD = '2.1.323';

    public function test_on_a_contained_host_codex_is_refused_and_a_claude_code_terminal_is_admitted(): void
    {
        $this->containedHost([DriverType::Terminal]);

        $this->assertSame(
            [StartPreflightRefusal::DriverNotContainable],
            $this->preflight()->refusals($this->proposal(DefaultDrivers::CODEX, DriverType::Headless)),
        );
        $this->assertSame([], $this->preflight()->refusals($this->proposal(DefaultDrivers::CLAUDE_CODE, DriverType::Terminal)));
    }

    public function test_a_host_that_did_not_declare_headless_refuses_a_headless_start_and_reserves_nothing(): void
    {
        $this->containedHost([DriverType::Terminal]);
        $runtimes = AgentRuntime::query()->count();

        try {
            $this->preflight()->assertAdmitted($this->proposal(DefaultDrivers::CLAUDE_CODE, DriverType::Headless));
            $this->fail('A start the host never declared was admitted.');
        } catch (StartPreflightRefused $refused) {
            $this->assertSame(StartPreflightRefusal::CombinationNotDeclared, $refused->refusal);
        }

        $this->assertSame($runtimes, AgentRuntime::query()->count());
    }

    public function test_a_profile_preferring_another_driver_refuses_nothing_and_no_host_is_its_own_reason(): void
    {
        $preferring = new ProfileDefaults(
            'main-agent',
            1,
            DefaultDrivers::CLAUDE_CODE,
            ModelTier::Inventive,
            DriverType::Terminal,
        );

        $this->assertSame(
            [StartPreflightRefusal::NoHost],
            $this->preflight()->refusals(new StartProposal(
                $preferring,
                DefaultDrivers::CODEX,
                '0.165.0',
                DriverType::Headless,
                ExecutionModeType::ProtectedHost,
                null,
            )),
        );
    }

    /**
     * @param  list<DriverType>  $driverTypes
     */
    private function containedHost(array $driverTypes): void
    {
        $host = Host::create('contained host', 'secret', [base_path()], ArrangementType::Contained);
        $descriptors = array_map(
            fn (DriverType $driverType) => new HostDescriptor(
                $this->app->make(DriverCatalogue::class)->keyFor(DefaultDrivers::CLAUDE_CODE, $driverType),
                self::BUILD,
                ArrangementType::Contained,
                ExecutionModeType::RequiredContainer,
            ),
            $driverTypes,
        );
        $host->recordDescriptors(array_map(
            fn (EnrolledDescriptor $descriptor) => $descriptor->stored(),
            $this->app->make(HostDescriptorEnrollment::class)->enroll($descriptors),
        ));
    }

    private function proposal(string $driver, DriverType $driverType): StartProposal
    {
        return new StartProposal(
            new ProfileDefaults('main-agent', 1, null, ModelTier::Inventive, DriverType::Terminal),
            $driver,
            self::BUILD,
            $driverType,
            ExecutionModeType::RequiredContainer,
            null,
        );
    }

    private function preflight(): StartPreflight
    {
        return $this->app->make(StartPreflight::class);
    }
}
