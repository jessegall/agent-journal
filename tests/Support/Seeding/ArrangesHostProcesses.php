<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Accounts\SignInChallenges;
use App\Agents\Commands\CheckDriverBuild\CheckDriverBuildCommand;
use App\Agents\Commands\CheckSignIn\CheckSignInCommand;
use App\Agents\ContainerManifest;
use App\Agents\Drivers\Contracts\ProcessDriver;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Processes\ProcessDrivers;
use App\Agents\Drivers\Setup\DriverProfile;
use App\Agents\Drivers\Setup\DriverProfiles;
use App\Agents\Drivers\Work\DriverWork;
use App\Agents\Drivers\Work\DriverWorkers;
use App\Agents\Enums\SessionProcessStatus;
use App\Agents\Enums\WorkspaceUse;
use App\Agents\SecurityOptions;
use App\Connections\PublishedReleases;
use App\Files\Contracts\Files;
use App\Files\Enums\Permissions;
use App\Files\Enums\Place;
use App\Hosts\ClaimedRequests;
use App\Hosts\Commands\ClaimHostWorker\ClaimHostWorkerCommand;
use App\Hosts\Commands\ClaimRuntimeRequests\ClaimRuntimeRequestsCommand;
use App\Hosts\Commands\NotifyHostOrder\NotifyHostOrderCommand;
use App\Hosts\Commands\NotifyHostOutput\NotifyHostOutputCommand;
use App\Hosts\Commands\NotifyHostProcess\NotifyHostProcessCommand;
use App\Hosts\Commands\OpenHostProcess\OpenHostProcessCommand;
use App\Hosts\Commands\SendHostKeys\SendHostKeysCommand;
use App\Hosts\Contracts\HostChannel;
use App\Hosts\Data\HostProcessReportData;
use App\Hosts\Enums\HostOrderType;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Enums\HostProcessReportType;
use App\Hosts\Enums\HostProcessStatus;
use App\Hosts\Enums\HostProcessType;
use App\Hosts\Enums\HostRefusal;
use App\Hosts\Enums\RestartPolicy;
use App\Hosts\ProcessFeed;
use App\Models\Agents\AgentRuntime;
use App\Models\Hosts\HostOrder;
use App\Models\Hosts\HostProcess;
use App\Models\Sessions\SessionProcess;
use App\Support\MountRules;
use App\Terminals\PrivateValues;
use App\Values\ClaimedRequest;
use App\Values\ExecutionBudgets;
use App\Values\HostOrderSource;
use App\Values\HostProcessPlan;
use App\Values\RowGuard;
use App\Values\SignInChallenge;
use Closure;
use Illuminate\Contracts\Config\Repository;
use Illuminate\Process\Factory;
use Illuminate\Process\PendingProcess;
use Illuminate\Support\Facades\Facade;
use Illuminate\Support\Facades\Process;
use PHPUnit\Framework\Assert;
use Tests\Support\Connections\PublicRelease;
use Tests\Support\Hosts\RealHost;
use Tests\Support\Hosts\StandInHost;
use Tests\Support\Seeding\Exceptions\FixtureRefused;

/**
 * The processes a test's hosts run under protocol 1: opened through the real order, and moved by the reports their
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

    private RealHost|null $realHost = null;

    /**
     * The named host is ordered to open a native process of the type given, for the runtime given when it runs one;
     * the host has not reported it yet.
     */
    public function openHostProcess(
        string $host,
        string $name,
        HostProcessType $type = HostProcessType::Terminal,
        string|null $runtimeId = null,
    ): self {
        if (array_key_exists($name, $this->hostProcesses)) {
            throw FixtureRefused::occupiedAlias($name, 'host process');
        }

        $plan = new HostProcessPlan(
            HostProcessPurpose::Probe,
            $type,
            RestartPolicy::Never,
            ['sh', '-c', 'cat'],
            [],
            base_path(),
        );
        $this->openPlanned($host, $name, $runtimeId, $plan);

        return $this;
    }

    /**
     * The session's start is taken, by the named host or, for a driver the journal drives, by the journal already, and
     * the host is ordered to open a process of the purpose for it, which has not reported yet; the test showed the
     * driver's arrangement before it opened the runtime.
     */
    public function openHostProcessForStart(
        string $host,
        string $name,
        string $sessionId,
        HostProcessPurpose $purpose = HostProcessPurpose::AgentTerminal,
    ): self {
        $hostId = $this->hostCalled($host)->hostId;
        $start = SessionProcess::findCurrentOf($sessionId) ?? throw FixtureRefused::missingAlias('start', $sessionId, self::OWNER);

        $this->claimStartOf($hostId, $sessionId);

        $plan = new HostProcessPlan($purpose, HostProcessType::Terminal, RestartPolicy::Never, [
            'sh',
            '-c',
            'cat',
        ], [], base_path());
        $source = HostOrderSource::fromJournal();
        $runtimeId = AgentRuntime::findForSession($sessionId)?->id;
        $command = new OpenHostProcessCommand($hostId, $runtimeId, $plan, $source, $start->id);
        $this->hostProcesses[$name] = $this->asSystem($command);

        return $this;
    }

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
            $source = HostOrderSource::fromJournal();
            $process = $this->asSystem(new OpenHostProcessCommand($runtime->host_id, $runtime->id, $plan, $source));
            $this->requestWorkers[$runtime->id] = [
                $process,
                $this->asSystem(new ClaimHostWorkerCommand($process)),
            ];
        }

        return $this->requestWorkers[$runtime->id];
    }

    /**
     * Names the runtime's newest process of the purpose, one the journal opened itself, so the test can report on it.
     */
    public function callJournalProcess(string $name, string $runtimeId, HostProcessPurpose $purpose): self
    {
        $this->hostProcesses[$name] = HostProcess::query()
            ->where('agent_runtime_id', $runtimeId)
            ->where('purpose', $purpose)
            ->latest('id')
            ->firstOrFail()
            ->id;

        return $this;
    }

    /**
     * Names the host's newest process of the purpose, one the journal opened for the host itself, such as a probe of
     * the agent image, so the test can report on it.
     */
    public function callHostProcessOf(string $name, string $host, HostProcessPurpose $purpose): self
    {
        $this->hostProcesses[$name] = HostProcess::query()
            ->where('host_id', $this->hostCalled($host)->hostId)
            ->where('purpose', $purpose)
            ->latest('id')
            ->firstOrFail()
            ->id;

        return $this;
    }

    /**
     * The runtime's build probe, which the journal ordered, prints the pinned build, so its sign-in probe is ordered
     * next; both are named for the test as <name>-probe and <name>-sign-in.
     */
    public function passBuildProbe(string $name, string $runtimeId): self
    {
        $build = $this->driverProfile(DefaultDrivers::CLAUDE_CODE)->build();
        $this->callJournalProcess("{$name}-probe", $runtimeId, HostProcessPurpose::BuildProbe);
        $this->asSystem(new CheckDriverBuildCommand($this->hostProcessCalled("{$name}-probe")->id, "{$build} (Claude Code)\n"));

        return $this->callJournalProcess("{$name}-sign-in", $runtimeId, HostProcessPurpose::SignInProbe);
    }

    /**
     * The Codex runtime's build probe prints the pinned build, its account holds a sign-in file and its sign-in probe
     * prints a ChatGPT sign-in, so its start is proven; the probes are named <name>-probe and <name>-sign-in.
     */
    public function passCodexProbes(string $name, string $runtimeId): self
    {
        $build = $this->driverProfile(DefaultDrivers::CODEX)->build();
        $this->callJournalProcess("{$name}-probe", $runtimeId, HostProcessPurpose::BuildProbe);
        $this->asSystem(new CheckDriverBuildCommand($this->hostProcessCalled("{$name}-probe")->id, "codex-cli {$build}\n"));
        $this->callJournalProcess("{$name}-sign-in", $runtimeId, HostProcessPurpose::SignInProbe);
        $signIn = $this->hostProcessCalled("{$name}-sign-in");
        $files = $this->service(Files::class);
        $folder = $files->pathIn(Place::Accounts, $signIn->sessionProcess()->sole()->directory);
        $files->makeFolder($folder, Permissions::OwnerOnly);
        $files->write($folder->child('auth.json'), '{}', Permissions::OwnerOnly);
        $this->asSystem(new CheckSignInCommand($signIn->id, "Logged in using ChatGPT\n"));

        return $this;
    }

    /**
     * Every JSON line the journal ordered written to the named pipe process's input, decoded, in order.
     *
     * @return list<array<string, mixed>>
     */
    public function pipeInputOf(string $name): array
    {
        $writes = array_filter(
            $this->hostOrdersOf($name),
            fn (HostOrder $order) => $order->type === HostOrderType::WriteStdin,
        );

        return array_values(array_map(
            fn (HostOrder $order) => json_decode(base64_decode($this->payloadOf($order)['bytes']), true, flags: JSON_THROW_ON_ERROR),
            $writes,
        ));
    }

    /**
     * Names the live owner that runs the headless turns of the runtime's current start's account.
     */
    public function callAccountOwner(string $name, string $runtimeId): self
    {
        $runtime = AgentRuntime::query()->whereKey($runtimeId)->sole();
        $start = SessionProcess::findCurrentOf($runtime->agent_session_id) ?? throw FixtureRefused::missingAlias(
            'current start',
            $runtimeId,
            self::OWNER,
        );

        $this->hostProcesses[$name] = HostProcess::query()
            ->ofPurposes([HostProcessPurpose::AccountOwner])
            ->live()
            ->whereHas('sessionProcess', fn ($owned) => $owned->onAccountGenerationOf($start))
            ->latest('id')
            ->firstOrFail()
            ->id;

        return $this;
    }

    /**
     * The order's payload as the host receives it, read back from its JSON.
     *
     * @return array<string, mixed>
     */
    public function payloadOf(HostOrder $order): array
    {
        return json_decode($order->payload, true, flags: JSON_THROW_ON_ERROR);
    }

    public function hostProcessCalled(string $name): HostProcess
    {
        $id = $this->hostProcesses[$name] ?? throw FixtureRefused::missingAlias('host process', $name, self::OWNER);

        return HostProcess::query()->whereKey($id)->sole();
    }

    /**
     * The process's host reports it as the report type says, with the exit code given when it exited.
     */
    public function reportHostProcess(string $name, HostProcessReportType $report, int|null $exitCode = null): self
    {
        $process = $this->hostProcessCalled($name);
        $this->asSystem(new NotifyHostProcessCommand(
            $process->host_id,
            $process->id,
            HostProcessReportData::from(['report' => $report, 'identity' => "pid:{$name}", 'exit_code' => $exitCode]),
        ));

        return $this;
    }

    /**
     * The orders made for the named process, oldest first.
     *
     * @return list<HostOrder>
     */
    public function hostOrdersOf(string $name): array
    {
        return HostOrder::findForProcess($this->hostProcessCalled($name)->id);
    }

    /**
     * The orders made for the named host itself, for no process of it, oldest first.
     *
     * @return list<HostOrder>
     */
    public function hostOrdersOn(string $host): array
    {
        return HostOrder::findForHostItself($this->hostCalled($host)->hostId);
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
     * A browser submitted the private value under the submission id, which now waits for its host to pull it.
     */
    public function submitPrivateValue(string $submissionId, string $value): self
    {
        $this->app->make(PrivateValues::class)->keep($submissionId, $value);

        return $this;
    }

    /**
     * The named pipe process's host sends what it printed next on its standard output, right after what it sent before.
     */
    public function printOnPipe(string $name, string $printed): self
    {
        $process = $this->hostProcessCalled($name);
        $chunk = ['stream' => 'stdout', 'offset' => $process->output_offset, 'bytes' => base64_encode($printed)];
        $body = json_encode(['chunks' => [$chunk]], JSON_THROW_ON_ERROR);
        $this->asSystem(new NotifyHostOutputCommand($process->host_id, $process->id, $body));

        return $this;
    }

    /**
     * The named process's host sends a frame whose first row reads as given.
     */
    public function printOnHostProcess(string $name, string $firstRow): self
    {
        $process = $this->hostProcessCalled($name);
        $frame = ['rows' => [$firstRow], 'cursor_row' => 0, 'cursor_column' => 0, 'columns' => 80, 'captured' => 1];
        $body = json_encode(['frames' => [[
            ...$frame,
            'unchanged_ms' => [0],
        ]]], JSON_THROW_ON_ERROR);
        $this->asSystem(new NotifyHostOutputCommand($process->host_id, $process->id, $body));

        return $this;
    }

    /**
     * The order's host answers it as carried out.
     */
    public function answerHostOrder(HostOrder $order): self
    {
        $this->asSystem(new NotifyHostOrderCommand($order->host_id, $order->id, '{"status":"done"}'));

        return $this;
    }

    /**
     * The order's host answers it as carried out, with the facts it found.
     *
     * @param  array<string, mixed>  $facts
     */
    public function answerHostOrderWith(HostOrder $order, array $facts): self
    {
        $body = json_encode(['status' => 'done', 'facts' => $facts], JSON_THROW_ON_ERROR);
        $this->asSystem(new NotifyHostOrderCommand($order->host_id, $order->id, $body));

        return $this;
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
     * The order's host refuses it for the reason given.
     */
    public function refuseHostOrder(HostOrder $order, HostRefusal $refusal): self
    {
        $body = json_encode(['status' => 'refused', 'refusal' => $refusal->value], JSON_THROW_ON_ERROR);
        $this->asSystem(new NotifyHostOrderCommand($order->host_id, $order->id, $body));

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
     * The host channel plays the committed recording in the folder, relative to the journal's recordings.
     */
    public function playsRecording(string $recording): self
    {
        $this->app->instance(
            HostChannel::class,
            StandInHost::playing(resource_path("recordings/{$recording}")),
        );

        return $this;
    }

    public function standInHost(): StandInHost
    {
        return $this->app->make(HostChannel::class);
    }

    /**
     * The named host runs for real: the host binary built from the checkout, against the Docker stand-in it carries
     * and the test application on a port of its own. The test commits its rows, so the served application sees them.
     */
    public function runRealHost(string $host): self
    {
        $database = (string) $this->app->make(Repository::class)->get('database.connections.pgsql.database');
        $this->realHost = RealHost::start($this->app->make(Factory::class), $this->hostCalled($host), $database);

        return $this;
    }

    /**
     * Opens a container of the stand-in's echo program on the named host, which must run for real.
     */
    public function openEchoContainer(
        string $host,
        string $name,
        string|null $runtimeId = null,
        RestartPolicy $restart = RestartPolicy::Never,
    ): self {
        $plan = new HostProcessPlan(
            HostProcessPurpose::Probe,
            HostProcessType::Terminal,
            $restart,
            ['echo-program'],
            [],
            '/workspace',
            ContainerManifest::make(
                RealHost::IMAGE,
                '10001:10001',
                true,
                [],
                false,
                "journal-net-{$name}",
                [MountRules::local()->workspaceMount($this->realHostFolder(), WorkspaceUse::Shared)],
                [],
                ExecutionBudgets::defaults(),
                MountRules::local(),
                SecurityOptions::none(),
                true,
            ),
        );
        $this->openPlanned($host, $name, $runtimeId, $plan);

        return $this;
    }

    /**
     * Opens the key recorder on the named host, which must run for real, as a native terminal: every byte typed on it
     * is written to a file of the installation and the typed text drawn on its screen.
     */
    public function openKeyRecorder(string $host, string $name): self
    {
        $installation = $this->realHostInstallation();
        $plan = new HostProcessPlan(
            HostProcessPurpose::Probe,
            HostProcessType::Terminal,
            RestartPolicy::Never,
            ["{$installation}/bin/journal-agent", 'standin', 'keys', '--record', "{$installation}/keys-{$name}"],
            [],
            $this->realHostFolder(),
        );
        $this->openPlanned($host, $name, null, $plan);

        return $this;
    }

    /**
     * Every byte the named key recorder read so far, as it reached the program.
     */
    public function keysRecordedBy(string $name): string
    {
        $file = "{$this->realHostInstallation()}/keys-{$name}";

        return is_file($file) ? (string) file_get_contents($file) : '';
    }

    /**
     * Opens a local process of pipes on the named host, which must run for real, with the argv and the start
     * credentials of the runtime, handed over as the journal hands them to a process it orders opened.
     *
     * @param  list<string>  $argv
     */
    public function openWithStartCredentials(string $host, string $name, string $runtimeId, array $argv): self
    {
        $runtime = AgentRuntime::query()->whereKey($runtimeId)->sole();
        $credentials = $runtime->handOverStartCredentials($this->realHostJournalUrl());
        $plan = new HostProcessPlan(
            HostProcessPurpose::Probe,
            HostProcessType::Pipe,
            RestartPolicy::Never,
            $argv,
            $credentials->environment(),
            base_path(),
        );
        $this->openPlanned($host, $name, $runtimeId, $plan);

        return $this;
    }

    /**
     * The journal the real host reaches goes away for the seconds and comes back, as after a crash of the app.
     */
    public function restartJournalOfRealHost(float $seconds = 1.0): self
    {
        $this->realHost?->restartJournal($seconds);

        return $this;
    }

    /**
     * A driver worker begins on the named process in this test's process. The worker service is taken anew for each
     * call, as the test's sync queue forgets scoped services after every job, which no real worker process runs.
     */
    public function beginDriverWorker(string $name): DriverWork
    {
        return $this->app->make(DriverWorkers::class)->begin($this->hostProcessCalled($name)->id);
    }

    /**
     * The worker takes its next step, waiting up to the milliseconds, and answers whether it goes on.
     */
    public function stepDriverWorker(DriverWork $work, int $waitMs): bool
    {
        return $this->app->make(DriverWorkers::class)->step($work, $waitMs);
    }

    /**
     * The real host, its Docker stand-in and its served journal stop, before the test's rows are emptied; nothing
     * happens when none runs.
     */
    public function stopRealHost(): self
    {
        $this->realHost?->stop();
        $this->realHost = null;

        return $this;
    }

    /**
     * The real host's stand-in for Claude Code holds each headless turn after its first lines until it is released.
     */
    public function holdStandInTurns(): self
    {
        $this->realHost?->holdTurns();

        return $this;
    }

    public function releaseStandInTurns(): self
    {
        $this->realHost?->releaseTurns();

        return $this;
    }

    /**
     * The driver accounts are chosen in folders of the running real host, so a stand-in started for an account can
     * write into its account folder, as Claude Code writes a conversation's transcript there.
     */
    public function chooseActiveAccountsOnRealHost(): self
    {
        $folder = "{$this->realHostFolder()}/accounts";

        foreach (DefaultDrivers::familyKeys() as $driver) {
            mkdir("{$folder}/{$driver}", 0o700, true);
        }

        return $this->chooseActiveAccounts($folder);
    }

    /**
     * The journal types the keys on the named process, guarded by the screen its host last sent, as a key script does.
     */
    public function typeOnHostProcess(string $name, string $keys): self
    {
        $process = $this->hostProcessCalled($name);
        $rows = $this->service(ProcessFeed::class)->latestFrame($process->id)?->rows
            ?? throw FixtureRefused::missingAlias('screen of host process', $name, self::OWNER);
        $guard = new RowGuard(0, count($rows) - 1, hash('sha256', implode("\n", $rows)));

        $this->asSystem(new SendHostKeysCommand($process->id, $keys, $guard, 0, HostOrderSource::fromJournal()));

        return $this;
    }

    /**
     * The journal proves the runtime's start on the real host: its build probe, then its sign-in probe, run there and
     * are driven until the process the proven start opens is ordered, which the test then calls by the name.
     */
    public function proveStartOnRealHost(string $runtimeId, HostProcessPurpose $opens, string $name): self
    {
        $ordered = fn (HostProcessPurpose $purpose) => fn () => HostProcess::query()
            ->where('agent_runtime_id', $runtimeId)
            ->where('purpose', $purpose)
            ->exists();
        $this->callJournalProcess('probe', $runtimeId, HostProcessPurpose::BuildProbe)
            ->driveHostProcess('probe', $ordered(HostProcessPurpose::SignInProbe));
        $this->callJournalProcess('sign-in', $runtimeId, HostProcessPurpose::SignInProbe)
            ->driveHostProcess('sign-in', $ordered($opens));

        return $this->callJournalProcess($name, $runtimeId, $opens);
    }

    /**
     * Each row of the newest screen the named process's host sent, as the journal's feed holds it; none before the
     * first.
     *
     * @return list<string>
     */
    public function hostProcessRows(string $name): array
    {
        $frame = $this->service(ProcessFeed::class)->latestFrame($this->hostProcessCalled($name)->id);

        return $frame === null ? [] : $frame->rows;
    }

    /**
     * Each start of the real host's Claude Code stand-in on a terminal, by the arguments it was started with.
     *
     * @return list<list<string>>
     */
    public function realHostClaudeStarts(): array
    {
        $host = $this->realHost ?? throw FixtureRefused::missingAlias('real host', 'starts', self::OWNER);

        return $host->claudeStarts();
    }

    /**
     * The owner's sign-ins are made as the real host runs them: this test reads the cache the served journal and its
     * runner share, and makes each attempt's folder under the host's own accounts folder.
     */
    public function shareSignInsWithRealHost(): self
    {
        $host = $this->realHost ?? throw FixtureRefused::missingAlias('real host', 'sign-ins', self::OWNER);
        $this->app->make(Repository::class)->set([
            'cache.default' => 'file',
            'accounts.root' => $host->accountsFolder(),
        ]);
        $this->app->forgetInstance('cache');
        $this->app->forgetInstance('cache.store');
        Facade::clearResolvedInstance('cache');

        return $this;
    }

    /**
     * One pass of the real host's sign-in runner starts, taking the sign-in that waits for a host.
     */
    public function runSignInsOnRealHost(): self
    {
        ($this->realHost ?? throw FixtureRefused::missingAlias('real host', 'sign-ins', self::OWNER))->startSignIns();

        return $this;
    }

    /**
     * The challenge the real host's runner published for the attempt, waited for until it is there.
     */
    public function signInChallengeOf(string $attemptId, int $seconds = 20): SignInChallenge
    {
        $challenges = $this->app->make(SignInChallenges::class);
        $deadline = microtime(true) + $seconds;

        while ($challenges->challengeOf($attemptId) === null && microtime(true) < $deadline) {
            usleep(100_000);
        }

        return $challenges->challengeOf($attemptId)
            ?? throw FixtureRefused::missingAlias('sign-in challenge', $attemptId, self::OWNER);
    }

    /**
     * Waits for the real host's sign-in runner to end its pass, which must end well.
     */
    public function waitForSignInsOnRealHost(): self
    {
        $host = $this->realHost ?? throw FixtureRefused::missingAlias('real host', 'sign-ins', self::OWNER);
        Assert::assertTrue($host->waitForSignIns(), 'The sign-in runner failed: '.$host->printed());

        return $this;
    }

    /**
     * Each start of the real host's Codex stand-in on a terminal, by the arguments it was started with.
     *
     * @return list<list<string>>
     */
    public function realHostCodexStarts(): array
    {
        $host = $this->realHost ?? throw FixtureRefused::missingAlias('real host', 'starts', self::OWNER);

        return $host->codexStarts();
    }

    /**
     * The protected installation folder the real host runs account starts from.
     */
    public function realHostInstallation(): string
    {
        return $this->realHost?->installation() ?? throw FixtureRefused::missingAlias('real host', 'installation', self::OWNER);
    }

    /**
     * The real host's binary stops and starts again, its containers left running.
     */
    public function restartRealHost(): self
    {
        $this->realHost?->restartHost();

        return $this;
    }

    /**
     * A driver worker drives the named process in this test's own process, step by step, until the condition holds
     * or the seconds pass, and answers the worker for further driving.
     *
     * @param  Closure(): bool  $until
     */
    public function driveHostProcess(
        string $name,
        Closure $until,
        DriverWork|null $work = null,
        int $seconds = 10,
    ): DriverWork {
        $work ??= $this->beginDriverWorker($name);
        $deadline = microtime(true) + $seconds;

        while (! $until() && microtime(true) < $deadline && $this->stepDriverWorker($work, 200)) {
            continue;
        }

        Assert::assertTrue($until(), $this->drivenSoFar($name));

        return $work;
    }

    /**
     * Waits up to the seconds for the named process to reach the status, as its host reports it.
     */
    public function waitForHostProcess(string $name, HostProcessStatus $status, int $seconds = 10): self
    {
        $deadline = microtime(true) + $seconds;

        while ($this->hostProcessCalled($name)->status !== $status && microtime(true) < $deadline) {
            usleep(100_000);
        }

        Assert::assertSame($status, $this->hostProcessCalled($name)->status, (string) $this->realHost?->printed());

        return $this;
    }

    /**
     * What a worker that did not get there saw: the process's last frame, its orders and what the real host printed.
     */
    private function drivenSoFar(string $name): string
    {
        $process = $this->hostProcessCalled($name);
        $rows = $this->app->make(ProcessFeed::class)->latestFrame($process->id)?->rows ?? [];
        $orders = array_map(
            fn (HostOrder $order) => "{$order->type->value} {$order->status->value} {$order->refusal?->value}",
            $this->hostOrdersOf($name),
        );

        return "The worker of {$name} did not reach what the test waits for.\n"
            .'Its process is '.$process->status->value.'; the last frame shows: '.implode(' | ', $rows)."\n"
            .'Its orders: '.implode(', ', $orders)."\n"
            .$this->realHost?->printed();
    }

    private function realHostJournalUrl(): string
    {
        $realHost = $this->realHost ?? throw FixtureRefused::missingAlias('real host', 'running', self::OWNER);

        return $realHost->journalUrl();
    }

    private function openPlanned(string $host, string $name, string|null $runtimeId, HostProcessPlan $plan): void
    {
        $hostId = $this->hostCalled($host)->hostId;
        $this->hostProcesses[$name] = $this->asSystem(
            new OpenHostProcessCommand($hostId, $runtimeId, $plan, HostOrderSource::fromJournal()),
        );
    }

    private function realHostFolder(): string
    {
        return $this->realHost?->folder ?? throw FixtureRefused::missingAlias('real host', 'running', self::OWNER);
    }
}
