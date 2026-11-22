<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Contracts\DriverCatalogue;
use App\Contracts\StartPreflight;
use App\Enums\ArrangementType;
use App\Enums\DriverVariant;
use App\Enums\ExecutionModeType;
use App\Enums\HostProtocolVersion;
use App\Enums\StartPreflightRefusal;
use App\Exceptions\StartPreflightRefused;
use App\Models\AgentRuntime;
use App\Models\Host;
use App\Support\DefaultDrivers;
use App\Support\HostDescriptorEnrollment;
use App\Values\EnrolledDescriptor;
use App\Values\HostDescriptor;
use App\Values\ProfileDefaults;
use App\Values\StartProposal;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * The server answers whether a driver, variant and placement can start before anything stops or is reserved: the
 * profile's pinned driver, contained Codex and the combinations the host declared each refuse with their reason.
 */
final class StartPreflightTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['hosts', 'agent_runtimes'];

    private const string BUILD = '2.1.323';

    public function test_on_a_contained_host_codex_is_refused_and_a_claude_code_terminal_is_admitted(): void
    {
        $this->containedHost([DriverVariant::Terminal]);

        $this->assertSame(
            [StartPreflightRefusal::DriverNotContainable],
            $this->preflight()->refusals($this->proposal(DefaultDrivers::CODEX, DriverVariant::Headless)),
        );
        $this->assertSame([], $this->preflight()->refusals($this->proposal(DefaultDrivers::CLAUDE_CODE, DriverVariant::Terminal)));
    }

    public function test_a_host_that_did_not_declare_headless_refuses_a_headless_start_and_reserves_nothing(): void
    {
        $this->containedHost([DriverVariant::Terminal]);
        $runtimes = AgentRuntime::query()->count();

        try {
            $this->preflight()->assertAdmitted($this->proposal(DefaultDrivers::CLAUDE_CODE, DriverVariant::Headless));
            $this->fail('A start the host never declared was admitted.');
        } catch (StartPreflightRefused $refused) {
            $this->assertSame(StartPreflightRefusal::CombinationNotDeclared, $refused->refusal);
        }

        $this->assertSame($runtimes, AgentRuntime::query()->count());
    }

    public function test_a_pinned_profile_refuses_another_driver_and_no_host_is_its_own_reason(): void
    {
        $pinned = new ProfileDefaults('main-agent', 1, DefaultDrivers::CLAUDE_CODE, true, 'opus', [], DriverVariant::Terminal);

        $this->assertSame(
            [StartPreflightRefusal::DriverPinned, StartPreflightRefusal::NoHost],
            $this->preflight()->refusals(new StartProposal(
                $pinned,
                DefaultDrivers::CODEX,
                '0.165.0',
                DriverVariant::Headless,
                ExecutionModeType::ProtectedHost,
                null,
            )),
        );
    }

    /**
     * @param  list<DriverVariant>  $variants
     */
    private function containedHost(array $variants): void
    {
        $host = Host::create('contained host', 'secret', [base_path()], ArrangementType::Contained);
        $descriptors = array_map(
            fn (DriverVariant $variant) => new HostDescriptor(
                $this->app->make(DriverCatalogue::class)->keyFor(DefaultDrivers::CLAUDE_CODE, $variant),
                self::BUILD,
                DefaultDrivers::PROTOCOL_VERSION,
                ArrangementType::Contained,
                ExecutionModeType::RequiredContainer,
            ),
            $variants,
        );
        $host->recordDescriptors(HostProtocolVersion::current()->value, array_map(
            fn (EnrolledDescriptor $descriptor) => $descriptor->stored(),
            $this->app->make(HostDescriptorEnrollment::class)->enroll($descriptors),
        ));
    }

    private function proposal(string $driver, DriverVariant $variant): StartProposal
    {
        return new StartProposal(
            new ProfileDefaults('main-agent', 1, null, false, 'opus', [], DriverVariant::Terminal),
            $driver,
            self::BUILD,
            $variant,
            ExecutionModeType::RequiredContainer,
            null,
        );
    }

    private function preflight(): StartPreflight
    {
        return $this->app->make(StartPreflight::class);
    }
}
