<?php

declare(strict_types=1);

namespace Tests\Support\Hosts;

use App\Support\EnrolledHost;
use Illuminate\Contracts\Process\InvokedProcess;
use Illuminate\Process\Factory;
use PHPUnit\Framework\Assert;
use Symfony\Component\Process\InputStream;

/**
 * The real host binary, built from the checkout, run against the Docker stand-in daemon it carries and the test
 * application served on a port of its own, so a test sees host protocol 1 work end to end without a real Docker.
 * Every process it starts ends when it is stopped or let go.
 */
final class RealHost
{
    /**
     * The image the stand-in daemon holds, pinned by digest as a host requires.
     */
    public const string IMAGE = 'registry.example/journal-echo@sha256:'
        .'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

    private const string BUILDS = 'storage/framework/test-host';

    /**
     * @var list<InvokedProcess>
     */
    private array $running = [];

    private InvokedProcess|null $host = null;

    private InvokedProcess|null $journal = null;

    /**
     * The open standard input of each host process this started: it ends when this test's process dies, and with it
     * the host and the stand-in daemon, even when the test was killed before it could stop them.
     *
     * @var list<InputStream>
     */
    private array $inputs = [];

    private int $port = 0;

    private function __construct(
        private readonly Factory $processes,
        public readonly string $folder,
        private readonly string $database,
    ) {}

    /**
     * Starts the test application on the test's own database, the stand-in daemon and the host enrolled as the host
     * given.
     */
    public static function start(Factory $processes, EnrolledHost $host, string $database): self
    {
        $folder = sys_get_temp_dir().'/journal-real-host-'.bin2hex(random_bytes(6));
        mkdir($folder, 0o700, true);
        $real = new self($processes, $folder, $database);
        $real->port = self::freePort();
        $real->serveJournal();
        $socket = "{$folder}/docker.sock";
        $real->run([self::binary(), 'standin', 'docker', '--socket', $socket, '--image', self::IMAGE, '--until-input-ends']);
        file_put_contents("{$folder}/secret", $host->secret);
        $enrolled = $processes->run([
            self::binary(), 'enroll', '--journal', "http://127.0.0.1:{$real->port}", '--host', $host->hostId,
            '--state', "{$folder}/state", '--secret-file', "{$folder}/secret",
        ]);
        Assert::assertTrue($enrolled->successful(), 'The real host did not enroll: '.$enrolled->errorOutput());
        $real->installStandIns();
        $real->startHost();

        return $real;
    }

    /**
     * The host binary built for these sources by scripts/go-tests.sh, found by the same hash of them.
     */
    public static function binary(): string
    {
        $path = base_path(self::BUILDS.'/journal-agent-'.self::sourceHash());
        Assert::assertFileExists($path, 'No host is built for these Go sources: run composer test:go first.');

        return $path;
    }

    /**
     * The first sixteen hex digits of the SHA-256 of every Go source, go.mod and go.sum, in byte order of their
     * paths, as the build script works it out.
     */
    public static function sourceHash(): string
    {
        $root = base_path('tools/journal-agent');
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

        foreach (['host' => $this->host, 'journal' => $this->journal] as $name => $process) {
            $lines = explode("\n", $process?->output().$process?->errorOutput());
            $kept = preg_grep('/ (Accepted|Closing)$|Development Server/', $lines, PREG_GREP_INVERT) ?: [];
            $printed .= "--- {$name}\n".implode("\n", $kept);
        }

        return $printed;
    }

    /**
     * Stops the host binary and starts it again; the stand-in daemon and its containers run on.
     */
    public function restartHost(): void
    {
        self::end($this->host, SIGTERM);
        $this->startHost();
    }

    /**
     * The served journal and all its workers are killed, as in a crash of the app, and it comes back on the same port
     * after the seconds.
     */
    public function restartJournal(float $seconds): void
    {
        $this->killJournal();
        usleep((int) ($seconds * 1_000_000));
        $this->serveJournal();
    }

    public function stop(): void
    {
        $this->killJournal();

        foreach ([$this->host, ...$this->running] as $process) {
            self::end($process, SIGTERM);
        }

        $this->host = null;
        $this->running = [];
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
        $server = "php\0-S\0127.0.0.1:{$this->port}\0";

        foreach (glob('/proc/[0-9]*/cmdline') ?: [] as $commandLine) {
            if (str_starts_with(self::commandLineOf($commandLine), $server)) {
                posix_kill((int) basename(dirname($commandLine)), SIGKILL);
            }
        }

        $this->journal = null;
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
        $server = ['php', '-S', "127.0.0.1:{$this->port}", '-t', base_path('public'), base_path('public/index.php')];
        $command = [__DIR__.'/scripts/serve-until-input-ends.sh', ...$server];
        // The host holds one claim open as a long poll, so the server answers its reports beside it on other workers.
        $environment = [...getenv(), 'DB_DATABASE' => $this->database, 'PHP_CLI_SERVER_WORKERS' => '8'];
        $this->journal = $this->processes->env($environment)->forever()->input($this->untilKilled())->start($command);
        usleep(200_000);
    }

    /**
     * Holds the stand-in's next headless turn after its first lines, until it is released.
     */
    public function holdTurns(): void
    {
        touch("{$this->installation()}/hold");
    }

    public function releaseTurns(): void
    {
        unlink("{$this->installation()}/hold");
    }

    public function installation(): string
    {
        return "{$this->folder}/installation";
    }

    /**
     * The protected installation the host runs account starts from holds the stand-in for Claude Code and the recorded
     * headless turn it plays.
     */
    private function installStandIns(): void
    {
        mkdir("{$this->installation()}/bin", 0o700, true);
        copy(__DIR__.'/scripts/claude-stand-in.sh', "{$this->installation()}/bin/claude");
        chmod("{$this->installation()}/bin/claude", 0o700);
        copy(__DIR__.'/fixtures/claude-turn.jsonl', "{$this->installation()}/turn.jsonl");
    }

    private function startHost(): void
    {
        $state = "{$this->folder}/state";
        $docker = "unix://{$this->folder}/docker.sock";
        $command = [
            self::binary(), 'protocol', '--state', $state, '--docker', $docker, '--until-input-ends',
            '--installation', $this->installation(), '--hook-command', "{$this->installation()}/bin/journal-hook",
        ];
        $this->host = $this->processes->env(getenv())->forever()->input($this->untilKilled())->start($command);
        usleep(200_000);
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
}
