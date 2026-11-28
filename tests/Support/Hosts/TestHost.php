<?php

declare(strict_types=1);

namespace Tests\Support\Hosts;

use App\Agents\ContainerManifest;
use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Work\RuntimeStarts;
use App\Agents\Enums\WorkspaceUse;
use App\Agents\SecurityOptions;
use App\Hosts\EnrolledHost;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Enums\RestartPolicy;
use App\Hosts\Protocol\HostProcessType;
use App\Models\Agents\AgentRuntime;
use App\Projects\Enums\ArrangementType;
use App\Sessions\AgentClientSettings;
use App\Support\HelperMounts;
use App\Support\Recordings\Scenarios\Scenario;
use App\Support\Recordings\Scenarios\ScenarioPlayer;
use App\Values\ExecutionBudgets;
use App\Values\HostProcessPlan;
use Closure;
use Illuminate\Contracts\Config\Repository;
use Illuminate\Contracts\Process\InvokedProcess;
use Illuminate\Process\Factory;
use PHPUnit\Framework\Assert;
use Symfony\Component\Process\InputStream;
use Tests\Support\Docker\AgentDaemonFolders;
use Tests\Support\Hosts\Steps\CompletesBrowserSignIn;
use Tests\Support\Hosts\Steps\Contracts\HostStep;
use Tests\Support\Hosts\Steps\ReleasesTurns;
use Tests\Support\Mocks\Mock;
use Tests\Support\Recordings\PlayedScenario;
use Tests\Support\Recordings\TerminalCapture;
use Tests\Support\Seeding\TestJournal;

/**
 * The test host binary, built from the checkout, run against its Docker mock daemon and the test application, so a
 * test sees host protocol 1 end to end without a real Docker. Its verbs run in the scope runTestHost() opens, and
 * every process it starts ends when stopped or let go.
 */
final class TestHost
{
    /**
     * The image the mock daemon holds, pinned by digest as a host requires.
     */
    public const string IMAGE = 'registry.example/journal-echo@sha256:'
        .'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

    private const string BUILDS = 'storage/framework/test-host';

    /**
     * The installation name a contained mock host prefixes its containers with.
     */
    public const string INSTALLATION_NAME = 'journaltest';

    /**
     * The address a contained mock host's session containers reach the journal at.
     */
    public const string SESSION_JOURNAL_URL = 'http://journal.test:54700';

    /**
     * The program a container of the mock Docker runs as the recorded Claude Code terminal turn.
     */
    private const string RECORDED_PROGRAM = 'claude';

    private const string CLAUDE_BUILD = '2.1.332';

    /**
     * The recorded exchanges of the Claude Code build, which a contained host's session containers answer with.
     */
    private const string CLAUDE_EXCHANGES = 'resources/recordings/claude-code/'.self::CLAUDE_BUILD.'/exchanges';

    private const string CODEX_BUILD = '0.172.0';

    /**
     * How long the mock Docker daemon gets to open its socket.
     */
    private const int DAEMON_START_SECONDS = 10;

    public private(set) int $port = 0;

    /**
     * @var list<InvokedProcess>
     */
    private array $running = [];

    /**
     * @var array<string, Mock> each script the programs' mocks play, by its file
     */
    private array $mocks = [];

    private InvokedProcess|null $host = null;

    private InvokedProcess|null $servedJournal = null;

    /**
     * The served journal's driver worker supervisor, which a played scenario runs as a machine runs it.
     */
    private InvokedProcess|null $driverSupervisor = null;

    private InvokedProcess|null $signIns = null;

    /**
     * The open standard input of each host process this started: it ends when this test's process dies, and with it
     * the host and the mock daemon, even when the test was killed before it could stop them.
     *
     * @var list<InputStream>
     */
    private array $inputs = [];

    /**
     * How many times the host binary was started again since the test host began.
     */
    private int $restarts = 0;

    /**
     * The mock Docker daemon the host talks to.
     */
    private InvokedProcess|null $daemon = null;

    private function __construct(
        private readonly TestJournal $journal,
        public readonly string $name,
        private readonly Factory $processes,
        public readonly string $folder,
        private readonly string $database,
        private readonly string $ownerEmail,
        private readonly ArrangementType $arrangement,
        private readonly bool $showsDriverArrangements,
        private readonly PlayedScenario|null $playing,
        private readonly Scenario|null $terminalScenario,
    ) {}

    /**
     * Starts the test application on the test's own database with the test journal's owner, the mock daemon and the
     * host enrolled as the host given, in the arrangement it was enrolled with: a contained one runs every program in
     * a mock container, its session containers playing Claude Code's terminal recording.
     */
    public static function start(
        TestJournal $journal,
        string $name,
        Factory $processes,
        EnrolledHost $host,
        string $database,
        string $ownerEmail,
        ArrangementType $arrangement,
        bool $showsDriverArrangements,
        PlayedScenario|null $playing = null,
        Scenario|null $terminalScenario = null,
    ): self {
        $folder = sys_get_temp_dir().'/jh-'.bin2hex(random_bytes(6));
        mkdir($folder, 0o700, true);
        $real = new self(
            $journal,
            $name,
            $processes,
            $folder,
            $database,
            $ownerEmail,
            $arrangement,
            $showsDriverArrangements,
            $playing,
            $terminalScenario,
        );
        $real->port = self::freePort();
        $real->serveJournal();
        $real->daemon = $real->startDaemon();
        file_put_contents("{$folder}/secret", $host->secret);
        $enrolled = $processes->run([
            self::binary(), 'enroll', '--journal', "http://127.0.0.1:{$real->port}", '--host', $host->hostId,
            '--state', "{$folder}/state", '--secret-file', "{$folder}/secret",
        ]);
        Assert::assertTrue($enrolled->successful(), 'The test host did not enroll: '.$enrolled->errorOutput());
        $real->installMocks();
        $real->startHost();

        return $real;
    }

    /**
     * The host binary built for these sources by scripts/go-tests.sh, found by the same hash of them.
     */
    public static function binary(): string
    {
        return self::builtProgram('journal-runner');
    }

    /**
     * The first sixteen hex digits of the SHA-256 of every Go source, go.mod and go.sum, in byte instruction of their
     * paths, as the build script works it out.
     */
    public static function terminalBinary(): string
    {
        return self::builtProgram('journal-terminal');
    }

    private static function builtProgram(string $name): string
    {
        $path = base_path(self::BUILDS.'/'.$name.'-'.self::sourceHash());
        Assert::assertFileExists($path, "No {$name} is built for these Go sources: run sh scripts/go-test-host.sh.");

        return $path;
    }

    public static function sourceHash(): string
    {
        $root = base_path('programs/runner');
        $paths = [];
        $files = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($root, \FilesystemIterator::SKIP_DOTS));

        foreach ($files as $file) {
            $name = $file->getFilename();

            if (str_ends_with($name, '.go') || $name === 'go.mod' || $name === 'go.sum') {
                $paths[] = '.'.substr($file->getPathname(), strlen($root));
            }
        }

        sort($paths, SORT_STRING);
        $context = hash_init('sha256');

        foreach ($paths as $path) {
            hash_update_file($context, $root.substr($path, 1));
        }

        return substr(hash_final($context), 0, 16);
    }

    /**
     * The address the host, and every process it opens, reaches the journal at.
     */
    public function journalUrl(): string
    {
        return "http://127.0.0.1:{$this->port}";
    }

    /**
     * What the host binary and the served journal printed so far, without the server's connection lines, for a test
     * that failed to say why.
     */
    public function printed(): string
    {
        $printed = '';

        foreach (['host' => $this->host, 'journal' => $this->servedJournal] as $name => $process) {
            $lines = explode("\n", $process?->output().$process?->errorOutput());
            $kept = preg_grep('/ (Accepted|Closing)$|Development Server/', $lines, PREG_GREP_INVERT) ?: [];
            $printed .= "--- {$name}\n".implode("\n", $kept);
        }

        $containers = array_map(
            fn (array $container) => implode(' ', [...$container['entrypoint'] ?? [], ...$container['cmd'] ?? []]),
            $this->startedContainers(),
        );
        $printed .= "\n--- containers\n".implode("\n", $containers);

        return $printed;
    }

    /**
     * Stops the host binary and starts it again; the mock daemon and its containers run on. A played scenario's daemon
     * starts its recording afresh with the host, as the recording begins with the host's start.
     */
    public function restartHost(): self
    {
        $this->restarts++;
        self::end($this->host, SIGTERM);

        if ($this->playing !== null) {
            self::end($this->daemon, SIGTERM);
            @unlink("{$this->folder}/played-failures");
            @unlink("{$this->folder}/docker.sock");
            $this->daemon = $this->startDaemon();
        }

        $this->startHost();

        return $this;
    }

    /**
     * The served journal and all its workers are killed, as in a crash of the app, and it comes back on the same port
     * after the seconds.
     */
    public function restartJournal(float $seconds = 1.0): self
    {
        $this->killJournal();
        usleep((int) ($seconds * 1_000_000));
        $this->serveJournal();

        return $this;
    }

    /**
     * The host, its Docker mock and its served journal stop; a host stopped already stays stopped.
     */
    public function stop(): self
    {
        $this->killJournal();

        foreach ([$this->host, ...$this->running] as $process) {
            self::end($process, SIGTERM);
        }

        // Each wrapped process group ends once its input does, whatever the processes above did.
        foreach ($this->inputs as $input) {
            $input->close();
        }

        $this->host = null;
        $this->running = [];
        $this->inputs = [];

        return $this;
    }

    /**
     * The played Docker daemon answered every call the host made from its recording.
     */
    public function assertPlayedNoFailure(): self
    {
        Assert::assertSame([], $this->playedFailures());

        return $this;
    }

    /**
     * The host stops, and no process of the journal it was served on runs any more: server, driver supervisor or worker.
     */
    public function assertStopsWholly(): self
    {
        $this->stop();
        Assert::assertSame([], self::journalProcessesOn($this->port));
        Assert::assertSame([], self::driverProcesses());

        return $this;
    }

    /**
     * The driver accounts are chosen in folders of this host, so a mock started for an account can write into
     * its account folder, as Claude Code writes a conversation's transcript there.
     */
    public function chooseActiveAccounts(): self
    {
        // A played scenario's accounts sit in folders named as the journal names them, as its recording holds them.
        if ($this->playing !== null) {
            $this->journal->chooseActiveAccountsInIdFolders($this->accountsFolder());

            return $this;
        }

        foreach (DefaultDrivers::familyKeys() as $driver) {
            mkdir(TestJournal::accountFolderOf($this->accountsFolder(), $driver), 0o700, true);
        }

        $this->journal->chooseActiveAccounts($this->accountsFolder());

        return $this;
    }

    /**
     * The owner's sign-ins are made as this host runs them: the test reads the cache the served journal and its
     * runner share, and makes each attempt's folder under the host's own accounts folder.
     */
    public function shareSignIns(): self
    {
        $this->journal->shareSignIns($this->accountsFolder());

        return $this;
    }

    /**
     * Opens a container on this host whose program the mock Docker plays from the recorded Claude Code terminal turn.
     */
    public function openRecordedTerminal(
        string $name,
        string|null $runtimeId = null,
        RestartPolicy $restart = RestartPolicy::Never,
    ): self {
        $manifest = ContainerManifest::make(
            self::IMAGE,
            "journal-net-{$name}",
            [HelperMounts::local()->workspaceMount($this->folder, WorkspaceUse::Shared, $name)],
            ExecutionBudgets::defaults(),
            HelperMounts::local(),
            SecurityOptions::none(),
            true,
        );
        $plan = new HostProcessPlan(
            HostProcessPurpose::Probe,
            HostProcessType::Terminal,
            $restart,
            [self::RECORDED_PROGRAM],
            [],
            '/workspace',
            $manifest,
        );
        $this->journal->openPlannedProcess($this->name, $name, $plan, $runtimeId);

        return $this;
    }

    /**
     * Opens the key recorder on this host as a native terminal: every byte typed on it is written to a file of the
     * installation and the typed text drawn on its screen.
     */
    public function openKeyRecorder(string $name): self
    {
        $plan = new HostProcessPlan(
            HostProcessPurpose::Probe,
            HostProcessType::Terminal,
            RestartPolicy::Never,
            ["{$this->installation()}/bin/journal-terminal", 'mock', 'keys', '--record', "{$this->installation()}/keys-{$name}"],
            [],
            $this->folder,
        );
        $this->journal->openPlannedProcess($this->name, $name, $plan);

        return $this;
    }

    /**
     * Opens a local process of pipes on this host with the argv and the start credentials of the runtime, handed over
     * as the journal hands them to a process it instructions opened, at this host's address of the served journal.
     *
     * @param  list<string>  $argv
     */
    public function openWithStartCredentials(string $name, string $runtimeId, array $argv): self
    {
        $runtime = AgentRuntime::query()->whereKey($runtimeId)->sole();
        $handed = $this->journal->service(RuntimeStarts::class)->clientSettingsOf($runtime);
        $credentials = new AgentClientSettings($this->journalUrl(), $handed->token, $handed->profile);
        $plan = new HostProcessPlan(
            HostProcessPurpose::Probe,
            HostProcessType::Pipe,
            RestartPolicy::Never,
            $argv,
            $credentials->environment(),
            base_path(),
        );
        $this->journal->openPlannedProcess($this->name, $name, $plan, $runtimeId);

        return $this;
    }

    /**
     * A process of this host the test named, handed to the scope.
     *
     * @param  Closure(TestHostProcess): mixed  $scope
     */
    public function process(string $name, Closure $scope): self
    {
        $this->journal->hostProcess($name, $scope);

        return $this;
    }

    public function __destruct()
    {
        $this->stop();
    }

    /**
     * Ends a process this started, unless it already ended by itself.
     */
    private static function end(InvokedProcess|null $process, int $signal): void
    {
        if ($process?->running() === true) {
            $process->signal($signal);
        }

        $process?->wait();
    }

    /**
     * Kills the served journal and every worker it forked, found by their command line, as no process of a crashed
     * app lives on; its handle is let go, as a process ended by a signal it did not send answers no wait.
     */
    private function killJournal(): void
    {
        foreach (self::journalProcessesOn($this->port) as $processId) {
            posix_kill($processId, SIGKILL);
        }

        self::end($this->driverSupervisor, SIGTERM);
        $this->servedJournal = null;
        $this->driverSupervisor = null;
    }

    /**
     * The ids of the served journal's processes on the port, its server and every worker it forked, by their command
     * line.
     *
     * @return list<int>
     */
    public static function journalProcessesOn(int $port): array
    {
        $server = implode("\x00", ['php', '-S', "127.0.0.1:{$port}", '']);
        $processIds = [];

        foreach (glob('/proc/[0-9]*/cmdline') ?: [] as $commandLine) {
            if (str_starts_with(self::commandLineOf($commandLine), $server)) {
                $processIds[] = (int) basename(dirname($commandLine));
            }
        }

        return $processIds;
    }

    /**
     * The ids of the journal's driver processes, its supervisor and every worker it started, by their command line.
     *
     * @return list<int>
     */
    public static function driverProcesses(): array
    {
        $processIds = [];

        foreach (glob('/proc/[0-9]*/cmdline') ?: [] as $commandLine) {
            $words = explode("\x00", self::commandLineOf($commandLine));

            $isArtisan = $words[0] === 'php' && str_ends_with($words[1] ?? '', 'artisan');

            if ($isArtisan && str_starts_with($words[2] ?? '', 'drivers:')) {
                $processIds[] = (int) basename(dirname($commandLine));
            }
        }

        return $processIds;
    }

    /**
     * A process's command line; empty for one that ended after it was listed, which is no process of the server.
     */
    private static function commandLineOf(string $path): string
    {
        try {
            return (string) new \SplFileObject($path)->fread(4096);
        } catch (\RuntimeException) {
            return '';
        }
    }

    private function untilKilled(): InputStream
    {
        $input = new InputStream();
        $this->inputs[] = $input;

        return $input;
    }

    private function serveJournal(): void
    {
        $server = ['php', '-S', "127.0.0.1:{$this->port}", '-t', base_path('public'), __DIR__.'/scripts/served-journal.php'];
        $command = [__DIR__.'/scripts/serve-until-input-ends.sh', ...$server];
        // A claim's long poll and a request waiting for a host's answer each hold a worker, so the server keeps enough
        // that the answer they wait for always finds one.
        $environment = [...$this->sharedEnvironment(), 'PHP_CLI_SERVER_WORKERS' => '32'];
        $this->servedJournal = $this->processes->env($environment)->forever()->input($this->untilKilled())
            ->start($command);
        usleep(200_000);

        // A played scenario runs the journal as a machine runs it: its driver workers read each process the host runs.
        if ($this->playing !== null) {
            $supervise = [
                __DIR__.'/scripts/serve-until-input-ends.sh',
                'php',
                base_path('artisan'),
                'drivers:supervise',
            ];
            $this->driverSupervisor = $this->processes->env($this->sharedEnvironment())->forever()
                ->input($this->untilKilled())->start($supervise);
        }
    }

    /**
     * What the served journal, its sign-in runner and the test share: the test's database, owner and shown driver
     * arrangements, one cache, so a sign-in's challenge and code pass between them, and the host's account folders.
     *
     * @return array<string, string>
     */
    private function sharedEnvironment(): array
    {
        $environment = [
            ...getenv(),
            'DB_DATABASE' => $this->database,
            'JOURNAL_OWNER_EMAIL' => $this->ownerEmail,
            'CACHE_STORE' => 'file',
            'ACCOUNTS_ROOT' => $this->accountsFolder(),
            'TEST_SHOWS_DRIVER_ARRANGEMENTS' => $this->showsDriverArrangements ? '1' : '0',
        ];

        if ($this->terminalScenario !== null) {
            $config = $this->journal->service(Repository::class);
            $environment = [
                ...$environment,
                'APP_ENV' => 'local',
                'JOURNAL_SERVER_ORIGIN' => $this->journalUrl(),
                'JOURNAL_RELEASE' => (string) $config->get('journal.agents.release'),
                'JOURNAL_RELEASES_FOLDER' => (string) $config->get('journal.files.places.releases'),
            ];
        }

        if (! $this->arrangement->isContained()) {
            return $environment;
        }

        return [
            ...$environment,
            ...self::containedEnvironment(),
            'AGENTS_INSTALLATION_NAME' => $this->installationName(),
            'AGENT_IMAGE' => $this->playing === null ? self::IMAGE : $this->playing->agentImage,
            'AGENTS_DEVELOPMENT_PROGRAMS' => $this->playing === null ? '' : $this->playing->developmentPrograms,
            // A played container's programs run in the test beside the served journal, and reach it where it listens.
            'AGENTS_SESSION_JOURNAL_URL' => $this->playing === null
                ? self::SESSION_JOURNAL_URL
                : "http://127.0.0.1:{$this->port}",
        ];
    }

    /**
     * The installation name the host's containers are prefixed with: the played scenario's when it plays one.
     */
    private function installationName(): string
    {
        return $this->playing === null ? self::INSTALLATION_NAME : $this->playing->installationName;
    }

    /**
     * Each call the played scenario's daemon could not answer from its recording, and each it held that was never
     * asked once it stopped, one line each.
     *
     * @return list<string>
     */
    public function playedFailures(): array
    {
        return self::linesOf("{$this->folder}/played-failures");
    }

    /**
     * Each text the played driver programs read, one line each, as the journal typed it into their terminals.
     *
     * @return list<string>
     */
    public function playedTyped(): array
    {
        return self::linesOf("{$this->folder}/played-typed");
    }

    /**
     * The lines a played daemon wrote to the file, none when it wrote none.
     *
     * @return list<string>
     */
    private static function linesOf(string $file): array
    {
        return is_file($file) ? array_values(array_filter(explode("\n", (string) file_get_contents($file)))) : [];
    }

    /**
     * The journal's settings of a contained mock host: its arrangement, installation name, agent image, the
     * agent containers' security profiles and one workspace.
     *
     * @return array<string, string>
     */
    public static function containedEnvironment(): array
    {
        return [
            'AGENTS_ARRANGEMENT' => ArrangementType::Contained->value,
            'AGENTS_INSTALLATION_NAME' => self::INSTALLATION_NAME,
            'AGENT_IMAGE' => self::IMAGE,
            'AGENTS_SECURITY_PROFILES' => base_path('.docker/helper'),
            'AGENTS_WORKSPACES' => '{"main":{"folder":"main"}}',
            'AGENTS_SESSION_JOURNAL_URL' => self::SESSION_JOURNAL_URL,
        ];
    }

    public function accountsFolder(): string
    {
        return "{$this->folder}/accounts";
    }

    /**
     * Starts one pass of the sign-in runner as a host runs it, signed with this host's secret, signing in with the
     * installation's mocks; it ends once the sign-in it took ended.
     */
    public function startSignIns(): self
    {
        chmod("{$this->folder}/secret", 0o600);
        $environment = [
            ...$this->sharedEnvironment(),
            'JOURNAL_URL' => $this->journalUrl(),
            'JOURNAL_HOST_SECRET_FILE' => "{$this->folder}/secret",
            'ACCOUNTS_CLAUDE_PROGRAM' => "{$this->installation()}/bin/claude",
            'ACCOUNTS_CODEX_PROGRAM' => "{$this->installation()}/bin/codex",
        ];
        $this->signIns = $this->processes->env($environment)->timeout(60)
            ->start(['php', base_path('artisan'), 'accounts:run-sign-ins', '--once']);

        return $this;
    }

    /**
     * Waits for the sign-in runner's pass to end, which must end well.
     */
    public function waitForSignIns(): self
    {
        Assert::assertTrue(
            $this->signIns?->wait()->successful() ?? false,
            'The sign-in runner failed: '.$this->printed(),
        );

        return $this;
    }

    /**
     * Holds the mock's next headless turn after its first lines, until it is released.
     */
    public function holdTurns(): self
    {
        touch("{$this->installation()}/hold");
        $this->forgetStep(ReleasesTurns::class);

        return $this;
    }

    public function releaseTurns(): self
    {
        unlink("{$this->installation()}/hold");
        $this->markRan(ReleasesTurns::class);

        return $this;
    }

    /**
     * The Claude Code mock plays the named session life recording in place of the default turn.
     */
    public function playClaudeTerminal(string $recording): self
    {
        $fixture = TerminalCapture::folderOf(DefaultDrivers::CLAUDE_CODE, $recording)->child('fixture.json');
        copy(base_path($fixture->relative), "{$this->installation()}/terminal-turn/fixture.json");

        return $this;
    }

    /**
     * The user completes the device sign-in in the browser, so the mock's login completes.
     */
    public function completeBrowserSignIn(): self
    {
        $this->markRan(CompletesBrowserSignIn::class);

        return $this;
    }

    public function installation(): string
    {
        return "{$this->folder}/installation";
    }

    /**
     * The programs' mocks play these scripts from now on, each from its first step.
     */
    public function mocks(Mock ...$mocks): self
    {
        foreach ($mocks as $mock) {
            $script = "{$this->mocksFolder()}/{$mock->scriptName()}";
            file_put_contents($script, json_encode($mock, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES));

            if (is_file("{$script}.played")) {
                unlink("{$script}.played");
            }

            $this->mocks[$mock->scriptName()] = $mock;
        }

        return $this;
    }

    /**
     * The steps run in order, each a step class or a step made with its values; a mock waiting for a step answers
     * on once it ran.
     *
     * @param  HostStep|class-string<HostStep>  ...$steps
     */
    public function scenario(HostStep|string ...$steps): self
    {
        foreach ($steps as $step) {
            $running = is_string($step) ? new $step() : $step;
            file_put_contents("{$this->stepsRan()}/current", class_basename($running));
            $running($this->journal);
            $this->markRan($running::class);
        }

        return $this;
    }

    /**
     * Every mock heard only what its script expected, and heard every line it expected.
     */
    public function assertMocksPlayed(): self
    {
        $failures = is_file($this->failuresFile()) ? (string) file_get_contents($this->failuresFile()) : '';
        Assert::assertSame('', trim($failures), "A mock heard what its script did not expect:\n{$failures}");

        foreach ($this->mocks as $name => $mock) {
            $played = "{$this->mocksFolder()}/{$name}.played";
            $count = is_file($played) ? (int) trim((string) file_get_contents($played)) : 0;
            $unheard = array_slice($mock->methods(), $count);
            Assert::assertSame([], $unheard, "The {$mock->program()} mock never heard what its script expected.");
        }

        return $this;
    }

    /**
     * The protected installation the host runs account starts from holds the mock for Claude Code and the recorded
     * headless turn it plays.
     */
    private function installMocks(): void
    {
        mkdir("{$this->installation()}/bin", 0o700, true);
        mkdir("{$this->installation()}/lib", 0o700);
        copy(__DIR__.'/scripts/lib/hold.sh', "{$this->installation()}/lib/hold.sh");
        copy(__DIR__.'/scripts/claude-mock.sh', "{$this->installation()}/bin/claude");
        chmod("{$this->installation()}/bin/claude", 0o700);
        copy(__DIR__.'/fixtures/claude-turn.jsonl', "{$this->installation()}/turn.jsonl");
        symlink(self::binary(), "{$this->installation()}/bin/journal-runner");
        symlink(self::terminalBinary(), "{$this->installation()}/bin/journal-terminal");
        mkdir("{$this->installation()}/terminal-turn", 0o700);
        copy($this->terminalFixture('claude-code'), "{$this->installation()}/terminal-turn/fixture.json");
        copy(__DIR__.'/scripts/codex-mock.sh', "{$this->installation()}/bin/codex");
        chmod("{$this->installation()}/bin/codex", 0o700);
        mkdir("{$this->installation()}/codex-terminal-turn", 0o700);
        mkdir($this->stepsRan(), 0o700, true);
        copy($this->terminalFixture('codex'), "{$this->installation()}/codex-terminal-turn/fixture.json");
        $this->installExchanges('claude-code', self::CLAUDE_BUILD);
        $this->installExchanges('codex', self::CODEX_BUILD);

        if ($this->terminalScenario !== null) {
            $this->installTerminalMocks($this->terminalScenario);
        }
    }

    /**
     * @param  list<string>  $arguments
     */
    public function changeTerminalMachine(array $arguments): int
    {
        $project = "{$this->folder}/project";
        $state = "{$this->folder}/terminal-state";
        $installation = $this->installation();

        if ($arguments[0] === ScenarioPlayer::CONNECT_PROJECT) {
            $ticket = file_get_contents(base_path(ScenarioPlayer::CONNECTION_TICKET));
            Assert::assertIsString($ticket);
            $connected = $this->processes->path($project)->input($ticket)->timeout(40)->run([
                "{$installation}/bin/journal-runner", 'mock', 'connect', $this->journalUrl(), $state,
            ]);
            Assert::assertTrue($connected->successful(), $connected->errorOutput());
            $binding = trim($connected->output());
            Assert::assertNotSame('', $binding);
            $this->running[] = $this->processes->forever()->start([
                "{$installation}/bin/journal-runner", 'relay', '--state', $state, '--binding', $binding,
            ]);

            return 0;
        }

        Assert::assertSame(ScenarioPlayer::START_TERMINAL, $arguments[0]);
        [, $driver, $model, $effort] = $arguments;
        $binary = "{$installation}/bin/journal-terminal";
        $this->running[] = $this->processes->path($project)->forever()->start([
            $binary, 'mock', 'launch', $binary, '--state', $state, '--model', $model, '--effort', $effort, $driver,
        ]);

        return 0;
    }

    private function installTerminalMocks(Scenario $scenario): void
    {
        $installation = $this->installation();
        $bin = "{$installation}/bin";
        $state = "{$this->folder}/terminal-state";
        mkdir("{$this->folder}/project", 0o700);
        mkdir("{$state}/allowed", 0o700, true);

        // The terminal and relay resolve their sealed installation from their real binary path.
        unlink("{$bin}/journal-runner");
        copy(self::binary(), "{$bin}/journal-runner");
        unlink("{$bin}/journal-terminal");
        copy(self::terminalBinary(), "{$bin}/journal-terminal");
        copy(self::builtProgram('journal-hook'), "{$bin}/journal-hook");

        foreach (['journal-runner', 'journal-terminal', 'journal-hook'] as $program) {
            chmod("{$bin}/{$program}", 0o700);
        }

        $driver = $scenario->driver();
        $profile = $this->journal->driverProfile($driver);
        $family = $this->journal->service(DriverCatalogue::class)->family($driver);
        file_put_contents("{$state}/allowed/installation.json", json_encode([
            'release' => 'installation',
            'drivers' => [$profile->executableHostName() => "{$bin}/{$family->hostName}"],
        ], JSON_THROW_ON_ERROR));
        file_put_contents("{$installation}/scenario", $scenario->name."\n");
        file_put_contents("{$installation}/repository", base_path()."\n");
    }

    private function terminalFixture(string $driver): string
    {
        return base_path($this->journal->recordedTerminal($driver)->folder->child('fixture.json')->relative);
    }

    /**
     * The exchanges the real driver of the build recorded, which its mock plays, under exchanges/<driver>.
     */
    private function installExchanges(string $driver, string $build): void
    {
        foreach (glob(base_path("resources/recordings/{$driver}/{$build}/exchanges/*/fixture.json")) ?: [] as $fixture) {
            $folder = "{$this->installation()}/exchanges/{$driver}/".basename(dirname($fixture));
            mkdir($folder, 0o700, true);
            copy($fixture, "{$folder}/fixture.json");
        }
    }

    /**
     * Each start of the Codex mock on a terminal, by the arguments it was started with, oldest first.
     *
     * @return list<list<string>>
     */
    public function codexStarts(): array
    {
        return $this->startsIn("{$this->installation()}/codex-started");
    }

    /**
     * Each start of the Claude Code mock on a terminal, by the arguments it was started with, oldest first.
     *
     * @return list<list<string>>
     */
    public function claudeStarts(): array
    {
        return $this->startsIn("{$this->installation()}/started");
    }

    /**
     * The starts a mock wrote to the file, one JSON list of arguments a line; none before its first.
     *
     * @return list<list<string>>
     */
    private function startsIn(string $file): array
    {
        if (! is_file($file)) {
            return [];
        }

        return array_map(
            fn (string $line) => json_decode($line, true, flags: JSON_THROW_ON_ERROR),
            file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [],
        );
    }

    /**
     * Each line the journal wrote to Codex's app-server, oldest first, as the mock heard it.
     *
     * @return list<array<string, mixed>>
     */
    public function heardByCodex(): array
    {
        return $this->startsIn("{$this->installation()}/codex-heard.jsonl");
    }

    /**
     * Every byte each key recorder read so far, as it reached the program, by the recorder's name.
     *
     * @return array<string, string>
     */
    public function keysRecorded(): array
    {
        $recorded = [];

        foreach (glob("{$this->installation()}/keys-*") ?: [] as $file) {
            $recorded[substr(basename($file), strlen('keys-'))] = (string) file_get_contents($file);
        }

        return $recorded;
    }

    /**
     * Each container the mock daemon started, oldest first, with its image, user, labels, argv, environment,
     * network and mounts.
     *
     * @return list<array<string, mixed>>
     */
    public function startedContainers(): array
    {
        return $this->startsIn("{$this->folder}/containers.jsonl");
    }

    /**
     * @return list<string>
     */
    private function mockDocker(): array
    {
        if ($this->playing !== null && $this->terminalScenario === null) {
            return [
                self::binary(), 'mock', 'playing', '--scenario', $this->playing->name, '--socket', "{$this->folder}/docker.sock",
                '--failures', "{$this->folder}/played-failures", '--typed', "{$this->folder}/played-typed",
                '--until-input-ends',
            ];
        }

        $command = [
            self::binary(), 'mock', 'docker', '--socket', "{$this->folder}/docker.sock", '--image', self::IMAGE,
            '--containers', "{$this->folder}/containers.jsonl", '--until-input-ends',
        ];

        $command = [
            ...$command,
            '--recording', dirname($this->terminalFixture('claude-code')),
            '--executable', self::RECORDED_PROGRAM,
            '--version-recording', base_path(self::CLAUDE_EXCHANGES.'/version'),
            '--sign-in-recording', base_path(self::CLAUDE_EXCHANGES.'/auth-status'),
        ];

        if (! $this->arrangement->isContained()) {
            return $command;
        }

        // A contained host's daemon holds its own folder and the folders compose.yaml gives the agent daemon, no more.
        $folders = [$this->folder, ...AgentDaemonFolders::of(base_path('compose.yaml'))];

        return [...$command, ...array_merge(...array_map(fn (string $folder) => ['--folder', $folder], $folders))];
    }

    private function startHost(): void
    {
        $state = "{$this->folder}/state";
        $docker = "unix://{$this->folder}/docker.sock";
        $command = [
            self::binary(), 'protocol', '--state', $state, '--docker', $docker, '--until-input-ends',
            '--installation', $this->installation(), '--hook-command', "{$this->installation()}/bin/journal-hook",
            '--arrangement', $this->arrangement->value,
        ];

        if ($this->arrangement->isContained()) {
            $command = [
                ...$command,
                '--installation-name', $this->installationName(),
                '--data-folder', HelperMounts::DATA_FOLDER,
            ];
        }

        // A played scenario's host checks the images the recorded host was installed with as it starts again, as the
        // recording begins with that start; the host ran before the recording, as the test host's first start does.
        if ($this->playing !== null && $this->playing->pinnedImages !== [] && $this->restarts > 0) {
            $command = [...$command, '--pinned-images', implode(',', $this->playing->pinnedImages)];
        }

        // The installation's programs come first on the host's path, so a program started by name runs its mock.
        $environment = [...getenv(), 'PATH' => "{$this->installation()}/bin:".getenv('PATH')];
        $this->host = $this->processes->env($environment)->forever()->input($this->untilKilled())->start($command);
        usleep(200_000);
        Assert::assertTrue($this->host->running(), 'The test host stopped: '.$this->host->errorOutput());
    }

    /**
     * The mock Docker daemon, started and kept among the running processes.
     */
    private function startDaemon(): InvokedProcess
    {
        $this->run($this->mockDocker());
        $daemon = $this->running[array_key_last($this->running)];
        $socket = "{$this->folder}/docker.sock";
        $deadline = microtime(true) + self::DAEMON_START_SECONDS;

        while (! file_exists($socket) && $daemon->running() && microtime(true) < $deadline) {
            usleep(50_000);
        }

        Assert::assertFileExists($socket, 'The mock Docker daemon did not open its socket: '.$daemon->errorOutput());

        return $daemon;
    }

    /**
     * @param  list<string>  $command
     */
    private function run(array $command): void
    {
        $this->running[] = $this->processes->env(getenv())->forever()->input($this->untilKilled())->start($command);
        usleep(200_000);
    }

    private static function freePort(): int
    {
        $socket = stream_socket_server('tcp://127.0.0.1:0');
        $name = (string) stream_socket_get_name($socket, false);
        fclose($socket);

        return (int) substr($name, strrpos($name, ':') + 1);
    }

    private function mocksFolder(): string
    {
        return "{$this->installation()}/mocks";
    }

    private function stepsRan(): string
    {
        return "{$this->mocksFolder()}/steps";
    }

    private function failuresFile(): string
    {
        return "{$this->mocksFolder()}/failures.jsonl";
    }

    /**
     * The step ran, so a mock that waits for it answers on.
     *
     * @param  class-string<HostStep>  $step
     */
    private function markRan(string $step): void
    {
        touch("{$this->stepsRan()}/".class_basename($step));
    }

    /**
     * @param  class-string<HostStep>  $step
     */
    private function forgetStep(string $step): void
    {
        $file = "{$this->stepsRan()}/".class_basename($step);

        if (is_file($file)) {
            unlink($file);
        }
    }
}
