<?php

declare(strict_types=1);

namespace Tests\Support\Hosts;

use App\Support\EnrolledHost;
use Illuminate\Contracts\Process\InvokedProcess;
use Illuminate\Process\Factory;
use PHPUnit\Framework\Assert;

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

    private int $port = 0;

    private function __construct(private readonly Factory $processes, public readonly string $folder) {}

    /**
     * Starts the test application, the stand-in daemon and the host enrolled as the host given.
     */
    public static function start(Factory $processes, EnrolledHost $host): self
    {
        $folder = sys_get_temp_dir().'/journal-real-host-'.bin2hex(random_bytes(6));
        mkdir($folder, 0o700, true);
        $real = new self($processes, $folder);
        $real->port = self::freePort();
        $real->serveJournal();
        $real->run([self::binary(), 'standin', 'docker', '--socket', "{$folder}/docker.sock", '--image', self::IMAGE]);
        file_put_contents("{$folder}/secret", $host->secret);
        $enrolled = $processes->run([
            self::binary(), 'enroll', '--journal', "http://127.0.0.1:{$real->port}", '--host', $host->hostId,
            '--state', "{$folder}/state", '--secret-file', "{$folder}/secret",
        ]);
        Assert::assertTrue($enrolled->successful(), 'The real host did not enroll: '.$enrolled->errorOutput());
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
     * Stops the host binary and starts it again; the stand-in daemon and its containers run on.
     */
    public function restartHost(): void
    {
        $this->host?->signal(SIGTERM);
        $this->host?->wait();
        $this->startHost();
    }

    /**
     * The served journal goes away for the seconds and comes back on the same port, as after a crash of the app.
     */
    public function restartJournal(float $seconds): void
    {
        $this->journal?->signal(SIGKILL);
        $this->journal?->wait();
        usleep((int) ($seconds * 1_000_000));
        $this->serveJournal();
    }

    public function stop(): void
    {
        foreach ([$this->host, $this->journal] as $process) {
            $process?->signal(SIGTERM);
            $process?->wait();
        }

        $this->host = null;
        $this->journal = null;

        foreach ($this->running as $process) {
            $process->signal(SIGTERM);
            $process->wait();
        }

        $this->running = [];
    }

    public function __destruct()
    {
        $this->stop();
    }

    private function serveJournal(): void
    {
        $command = ['php', '-S', "127.0.0.1:{$this->port}", '-t', base_path('public'), base_path('public/index.php')];
        $this->journal = $this->processes->env(getenv())->forever()->start($command);
        usleep(200_000);
    }

    private function startHost(): void
    {
        $state = "{$this->folder}/state";
        $command = [self::binary(), 'protocol', '--state', $state, '--docker', "unix://{$this->folder}/docker.sock"];
        $this->host = $this->processes->env(getenv())->forever()->start($command);
        usleep(200_000);
    }

    /**
     * @param  list<string>  $command
     */
    private function run(array $command): void
    {
        $this->running[] = $this->processes->env(getenv())->forever()->start($command);
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
