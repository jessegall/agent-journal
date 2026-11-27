<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Agents\DriverCatalogue;
use App\Agents\Drivers\Contracts\DriverCatalogue as DriverCatalogueContract;
use App\Agents\Drivers\Contracts\DriverCompatibilities;
use App\Agents\Drivers\Contracts\ProcessDriver;
use App\Agents\Drivers\Hooks\HookReplies;
use App\Agents\Drivers\Processes\ProcessDrivers;
use App\Agents\Drivers\Setup\DriverProfile;
use App\Agents\Drivers\Setup\DriverProfiles;
use App\Agents\Drivers\Setup\DriverSetup;
use App\Agents\Enums\SessionProcessStatus;
use App\Connections\PublishedReleases;
use App\Hosts\ArrangementSetting;
use App\Hosts\ClaimedRequests;
use App\Hosts\Commands\ClaimHostWorker\ClaimHostWorkerCommand;
use App\Hosts\Commands\ClaimRuntimeRequests\ClaimRuntimeRequestsCommand;
use App\Hosts\Commands\OpenHostProcess\OpenHostProcessCommand;
use App\Hosts\Contracts\HostChannel;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Enums\RestartPolicy;
use App\Hosts\ProcessFeed;
use App\Hosts\Protocol\HostInstructionType;
use App\Hosts\Protocol\HostProcessType;
use App\Models\Agents\AgentRuntime;
use App\Models\Hosts\HostInstruction;
use App\Models\Hosts\HostProcess;
use App\Models\Projects\Host;
use App\Models\Sessions\SessionProcess;
use App\Providers\DriversServiceProvider;
use App\Support\AgentImage;
use App\Support\Compatibility\PinnedBuilds;
use App\Values\ClaimedRequest;
use App\Values\DriverFamily;
use App\Values\HostInstructionSource;
use App\Values\HostProcessPlan;
use Closure;
use Illuminate\Contracts\Config\Repository;
use Illuminate\Process\Factory;
use Illuminate\Process\PendingProcess;
use Illuminate\Support\Facades\Process;
use Tests\Fixtures\Drivers\ShownDriverArrangements;
use Tests\Support\Connections\PublicRelease;
use Tests\Support\Hosts\MockHost;
use Tests\Support\Hosts\TestEnrolledHost;
use Tests\Support\Hosts\TestHost;
use Tests\Support\Hosts\TestHostInstruction;
use Tests\Support\Hosts\TestHostProcess;
use Tests\Support\Seeding\Exceptions\FixtureRefused;

/**
 * The processes a test's hosts run under protocol 1: opened through the real instruction, and moved by the reports their
 * host sends.
 */
trait ArrangesHostProcesses
{
    /**
     * @var array<string, string>
     */
    private array $hostProcesses = [];

    /**
     * @var array<string, array{string, int}>
     */
    private array $requestWorkers = [];

    private TestHost|null $testHost = null;

    /**
     * @var array<string, TestHostProcess> each named process's scope, kept so its driver worker carries on
     */
    private array $processScopes = [];

    /**
     * The request as a claim of the host's accepted requests hands it out, claimed as its driver worker claims it.
     */
    public function claimedRequestOnHost(string $hostId, string $requestId): ClaimedRequest
    {
        $claimed = $this->claimRequestsOnHost($hostId)->requests;

        return array_find($claimed, fn (ClaimedRequest $request) => $request->requestId === $requestId)
            ?? throw FixtureRefused::missingAlias('claimed request', $requestId, self::OWNER);
    }

    /**
     * Takes the session's pending start as the journal does for a driver it drives, and answers it.
     */
    public function claimStartOf(string $hostId, string $sessionId): SessionProcess
    {
        $start = SessionProcess::findLatestOfSession($sessionId)
            ?? throw FixtureRefused::missingAlias('start', $sessionId, self::OWNER);

        // A start the journal drives is taken by the journal the moment it is registered.
        if ($start->status !== SessionProcessStatus::Pending) {
            return $start;
        }

        // A host takes a pending start on itself, as the journal's own claim does.
        $start->claimOn($hostId);

        return $start;
    }

    /**
     * Claims the accepted requests of the host's runtimes as their driver workers do, each runtime's through a worker
     * of its own, at most the limit each, and answers them: the work the journal hands a driver, without a driver.
     */
    public function claimRequestsOnHost(string $hostId, int $limit = 10): ClaimedRequests
    {
        $claimed = [];

        foreach (AgentRuntime::query()->onHost($hostId)->withAcceptedRequest()->get() as $runtime) {
            [$processId, $generation] = $this->requestWorkerOf($runtime);
            $command = new ClaimRuntimeRequestsCommand($processId, $generation, $limit);
            $claimed = [...$claimed, ...$this->asSystem($command)->requests];
        }

        return new ClaimedRequests($claimed);
    }

    /**
     * The worker process that claims the runtime's requests and its generation, opened at its first claim.
     *
     * @return array{string, int}
     */
    private function requestWorkerOf(AgentRuntime $runtime): array
    {
        if (! array_key_exists($runtime->id, $this->requestWorkers)) {
            $plan = new HostProcessPlan(
                HostProcessPurpose::Probe,
                HostProcessType::Pipe,
                RestartPolicy::Never,
                ['sh', '-c', 'cat'],
                [],
                base_path(),
            );
            $source = HostInstructionSource::fromJournal();
            $process = $this->asSystem(new OpenHostProcessCommand($runtime->host_id, $runtime->id, $plan, $source));
            $this->requestWorkers[$runtime->id] = [
                $process,
                $this->asSystem(new ClaimHostWorkerCommand($process)),
            ];
        }

        return $this->requestWorkers[$runtime->id];
    }

    /**
     * The named host runs for real: the host binary built from the checkout, against the Docker mock it carries
     * and the test application on a port of its own, with the test journal's owner, made here when the test named
     * none; the scope acts on it. The test commits its rows, so the served application sees them.
     *
     * @param  Closure(TestHost): mixed  $scope
     */
    public function runTestHost(string $host, Closure $scope): self
    {
        if ($this->testHost !== null) {
            throw FixtureRefused::testHostRuns($this->testHost->name);
        }

        $database = (string) $this->app->make(Repository::class)->get('database.connections.pgsql.database');
        $this->testHost = TestHost::start(
            $this,
            $host,
            $this->app->make(Factory::class),
            $this->hostCalled($host),
            $database,
            ($this->owner ?? $this->owner()->ownerUser())->email,
            Host::query()->findOrFail($this->hostCalled($host)->hostId)->arrangement,
            $this->app->make(DriverCompatibilities::class) instanceof ShownDriverArrangements,
        );
        $scope($this->testHost);

        return $this;
    }

    /**
     * The test host already running, handed to the scope.
     *
     * @param  Closure(TestHost): mixed  $scope
     */
    public function testHost(Closure $scope): self
    {
        $scope($this->testHost ?? throw FixtureRefused::noTestHost());

        return $this;
    }

    /**
     * The test host the test runs stops, before the test's rows are emptied, and every mock it ran must have heard what
     * its script expected; nothing happens when none runs.
     */
    public function stopRunningHost(): self
    {
        $host = $this->testHost;
        $this->testHost = null;
        $host?->stop()->assertMocksPlayed();

        return $this;
    }

    /**
     * An enrolled host that runs no binary, handed to the scope to open processes on and report as.
     *
     * @param  Closure(TestEnrolledHost): mixed  $scope
     */
    public function host(string $host, Closure $scope): self
    {
        $this->hostCalled($host);
        $scope(new TestEnrolledHost($this, $host));

        return $this;
    }

    /**
     * The host process the test named, handed to the scope; the same process keeps its driver worker from one scope
     * to the next.
     *
     * @param  Closure(TestHostProcess): mixed  $scope
     */
    public function hostProcess(string $name, Closure $scope): self
    {
        if (! array_key_exists($name, $this->hostProcesses)) {
            throw FixtureRefused::unknownHostProcess($name, array_keys($this->hostProcesses));
        }

        $scope($this->processScopes[$name] ??= new TestHostProcess($this, $name));

        return $this;
    }

    /**
     * The instruction, handed to the scope to answer or refuse as its host.
     *
     * @param  Closure(TestHostInstruction): mixed  $scope
     */
    public function hostInstruction(HostInstruction $instruction, Closure $scope): self
    {
        $scope(new TestHostInstruction($this, $instruction));

        return $this;
    }

    /**
     * The test calls the host process of this id by the name, a process the journal opened itself or a test's open
     * instruction made.
     */
    public function nameHostProcess(string $name, string $processId): self
    {
        if (array_key_exists($name, $this->hostProcesses)) {
            throw FixtureRefused::occupiedAlias($name, 'host process');
        }

        $this->hostProcesses[$name] = $processId;

        return $this;
    }

    /**
     * The named host is ordered to open the planned process for the runtime given, if any, and the test calls it by
     * the name; the host has not reported it yet.
     */
    public function openPlannedProcess(
        string $host,
        string $name,
        HostProcessPlan $plan,
        string|null $runtimeId = null,
    ): self {
        $hostId = $this->hostCalled($host)->hostId;

        return $this->nameHostProcess(
            $name,
            $this->asSystem(new OpenHostProcessCommand($hostId, $runtimeId, $plan, HostInstructionSource::fromJournal())),
        );
    }

    /**
     * What the named process got and showed so far, for a failure to say: each instruction with what it wrote, everything
     * the process printed, its last screen and what the test host printed.
     */
    public function processReport(string $name): string
    {
        return $this->drivenSoFar($name);
    }

    /**
     * Every JSON line the journal ordered written to the named pipe process's input, decoded, in order.
     *
     * @return list<array<string, mixed>>
     */
    public function pipeInputOf(string $name): array
    {
        $writes = array_filter(
            $this->hostInstructionsOf($name),
            fn (HostInstruction $instruction) => $instruction->type === HostInstructionType::WriteStdin,
        );

        return array_values(array_map(
            fn (HostInstruction $instruction) => json_decode(
                base64_decode($this->payloadOf($instruction)['bytes']),
                true,
                flags: JSON_THROW_ON_ERROR,
            ),
            $writes,
        ));
    }

    /**
     * The instruction's payload as the host receives it, read back from its JSON.
     *
     * @return array<string, mixed>
     */
    public function payloadOf(HostInstruction $instruction): array
    {
        return json_decode($instruction->payload, true, flags: JSON_THROW_ON_ERROR);
    }

    public function hostProcessCalled(string $name): HostProcess
    {
        $id = $this->hostProcesses[$name] ?? throw FixtureRefused::missingAlias('host process', $name, self::OWNER);

        return HostProcess::query()->whereKey($id)->sole();
    }

    /**
     * The instructions made for the named process, oldest first.
     *
     * @return list<HostInstruction>
     */
    public function hostInstructionsOf(string $name): array
    {
        return HostInstruction::findForProcess($this->hostProcessCalled($name)->id);
    }

    /**
     * The instructions made for the named host itself, for no process of it, oldest first.
     *
     * @return list<HostInstruction>
     */
    public function hostInstructionsOn(string $host): array
    {
        return HostInstruction::findForHostItself($this->hostCalled($host)->hostId);
    }

    /**
     * Processes of the purpose are driven by the program driver given, as a domain that drives them registers it.
     *
     * @param  class-string<ProcessDriver>  $driver
     */
    public function driveProcessesWith(HostProcessPurpose $purpose, string $driver): self
    {
        $this->app->instance(ProcessDrivers::class, $this->app->make(ProcessDrivers::class)->with($purpose, $driver));

        return $this;
    }

    /**
     * The process driver of the named process's purpose, made for it as a worker of the generation makes it, so a
     * test feeds it entries and requests one by one.
     */
    public function processDriverOf(string $name, int $generation = 1): ProcessDriver
    {
        return $this->app->make(ProcessDrivers::class)->for($this->hostProcessCalled($name), $generation);
    }

    /**
     * The profile the journal starts the driver family by.
     */
    public function driverProfile(string $family): DriverProfile
    {
        return $this->service(DriverProfiles::class)->ofFamily($family);
    }

    /**
     * Every driver set up with the part given builds the replacement in its place.
     *
     * @param  class-string  $part
     * @param  class-string  $replacement
     */
    public function withDriverPart(string $part, string $replacement): self
    {
        $this->app->bind($part, $replacement);

        return $this;
    }

    /**
     * The journal runs its agents contained, as a contained mock host's served journal does: the same arrangement,
     * installation name, agent image, security profiles and workspace, so the sessions it opens freeze a container
     * policy.
     */
    public function arrangeContainedJournal(): self
    {
        $settings = [
            'agents.arrangement' => 'AGENTS_ARRANGEMENT',
            'agents.installation_name' => 'AGENTS_INSTALLATION_NAME',
            'agents.agent_image' => 'AGENT_IMAGE',
            'agents.security_profiles' => 'AGENTS_SECURITY_PROFILES',
            'agents.workspaces' => 'AGENTS_WORKSPACES',
            'agents.session_journal_url' => 'AGENTS_SESSION_JOURNAL_URL',
        ];
        $environment = TestHost::containedEnvironment();
        $this->app->make(Repository::class)->set(array_map(fn (string $name) => $environment[$name], $settings));
        $this->app->forgetInstance(ArrangementSetting::class);
        $this->app->forgetInstance(AgentImage::class);

        return $this;
    }

    /**
     * The journal from here on knows no folder of security profiles, as a service started without that setting does.
     */
    public function forgetSecurityProfiles(): self
    {
        $this->app->make(Repository::class)->set('agents.security_profiles', '');

        return $this;
    }

    /**
     * A driver family a module adds, registered in the catalogue and started as the existing family it runs like.
     */
    public function setUpDriverFamily(DriverFamily $family, string $runsLike): self
    {
        $this->service(DriverCatalogue::class)->registerFamily($family);
        $setups = DriversServiceProvider::setups();
        $like = array_values(array_filter($setups, fn (DriverSetup $setup) => $setup->family === $runsLike))[0];
        $this->app->scoped(DriverProfiles::class, fn () => new DriverProfiles(
            $this->app,
            $this->service(DriverCatalogueContract::class),
            $this->service(PinnedBuilds::class),
            $this->service(HookReplies::class),
            [...$setups, $like->forFamily($family->key)],
        ));
        $this->app->forgetInstance(DriverProfiles::class);

        return $this;
    }

    /**
     * The journal publishes the release given as its current one, with a signed manifest.
     */
    public function publishRelease(string $version): self
    {
        $folder = sys_get_temp_dir().'/published-releases-'.bin2hex(random_bytes(4));
        mkdir("{$folder}/{$version}", 0755, true);
        file_put_contents("{$folder}/{$version}/".PublishedReleases::MANIFEST, json_encode(
            PublicRelease::manifest($version),
            JSON_THROW_ON_ERROR,
        ));
        file_put_contents("{$folder}/{$version}/".PublishedReleases::SIGNATURE, 'signature');
        config(['files.places.releases' => $folder, 'agents.release' => $version]);
        $this->app->forgetInstance(PublishedReleases::class);

        return $this;
    }

    /**
     * Programs the journal starts run as fakes that end at once, so a test reads what was started.
     */
    public function fakeStartedPrograms(): self
    {
        Process::fake();

        return $this;
    }

    /**
     * @param  list<string>  $command
     */
    public function assertProgramStarted(array $command): self
    {
        Process::assertRan(fn (PendingProcess $process) => $process->command === $command);

        return $this;
    }

    /**
     * The host channel is a mock host that plays the committed recording in the folder, relative to the journal's
     * recordings; service(MockHost::class) reaches the same mock.
     */
    public function playRecording(string $recording): self
    {
        $host = MockHost::playing(resource_path("recordings/{$recording}"));
        $this->app->instance(HostChannel::class, $host);
        $this->app->instance(MockHost::class, $host);

        return $this;
    }

    /**
     * The mock host the journal's host channel is, handed to the scope.
     *
     * @param  Closure(MockHost): mixed  $scope
     */
    public function mockHost(Closure $scope): self
    {
        $scope($this->app->make(MockHost::class));

        return $this;
    }

    /**
     * What a worker that did not get there saw, so a failure says what went in, what came out and what showed: each
     * instruction with what it wrote, everything the process printed, its last screen and what the test host printed.
     */
    private function drivenSoFar(string $name): string
    {
        $process = $this->hostProcessCalled($name);
        $frame = $this->app->make(ProcessFeed::class)->latestFrame($process->id)?->rows ?? [];
        $instructions = implode("\n", array_map($this->writtenBy(...), $this->hostInstructionsOf($name)));
        $printed = $this->printedBy($process->id);
        $screen = implode("\n", $frame);

        return <<<TEXT
            The process {$name} did not reach what the test waits for; it is {$process->status->value}
            ({$process->exit_evidence}).
            --- what the journal ordered and wrote
            {$instructions}
            --- what the process printed
            {$printed}
            --- its last screen
            {$screen}
            {$this->testHost?->printed()}
            --- debug answered
            {$this->debugAnswered()}
            TEXT;
    }

    private function debugAnswered(): string
    {
        $folder = $this->testHost?->installation();
        $state = $folder === null ? '' : dirname($folder).'/state/instructions/answered.json';
        $ids = implode(',', array_map(fn (HostInstruction $instruction) => $instruction
            ->id.':'.$instruction->sequence, HostInstruction::query()->where('status', 'claimed')->get()->all()));

        return 'claimed in journal: '.$ids."\nhost answered: ".(is_file($state) ? substr(
            (string) file_get_contents($state),
            -3000,
        ) : 'none');
    }

    /**
     * One instruction as a failure shows it: its type, how the host answered and why, and the bytes it wrote, if any.
     */
    private function writtenBy(HostInstruction $instruction): string
    {
        $payload = $this->payloadOf($instruction);
        $encoded = $payload['bytes'] ?? null;
        $written = is_string($encoded) ? json_encode(
            base64_decode($encoded, true),
            JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE,
        ) : '';
        $reason = $instruction->answer?->reason ?? '';

        return "{$instruction->type->value} {$instruction->status->value} {$instruction->refusal?->value} {$reason} {$written}";
    }

    /**
     * Everything the process printed so far, each chunk with its stream, oldest first.
     */
    private function printedBy(string $processId): string
    {
        $feed = $this->app->make(ProcessFeed::class);
        $chunks = [];
        $cursor = '0';

        while (($entries = $feed->after($processId, $cursor, 0)) !== []) {
            foreach ($entries as $entry) {
                $cursor = $entry->cursor;
                $chunks[] = $entry->chunk === null ? null : "{$entry->chunk->stream}: ".json_encode(
                    $entry->printed(),
                    JSON_UNESCAPED_SLASHES,
                );
            }
        }

        return implode("\n", array_filter($chunks));
    }
}
