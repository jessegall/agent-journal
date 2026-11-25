<?php

declare(strict_types=1);

namespace Tests\Support\Installation;

use Dotenv\Dotenv;
use Illuminate\Support\Facades\File;
use Symfony\Component\Process\Process;

/**
 * An installation in a temporary folder whose Docker is a stand-in: the repository it follows is a real git
 * repository a test pushes to, the update script is the project's own, and the stand-in records every call a real
 * Docker would get and answers as a healthy one. Nothing here reaches a real Docker.
 */
final readonly class StandInInstallation
{
    private const string BRANCH = 'version-6';

    public StandInDocker $docker;

    private function __construct(private string $folder)
    {
        $this->docker = new StandInDocker("{$folder}/stand-in");
    }

    /**
     * A contained installation that has installed nothing yet, following a repository with the project's own Docker
     * scripts in its first commit.
     */
    public static function contained(): self
    {
        $token = getenv('TEST_TOKEN') ?: 'alone';
        $installation = new self(sys_get_temp_dir()."/installation-{$token}-".bin2hex(random_bytes(6)));

        foreach (['repository', 'installation/images', 'installation/secrets', 'state', 'stand-in'] as $part) {
            File::makeDirectory("{$installation->folder}/{$part}", 0o755, true);
        }

        File::copyDirectory(__DIR__.'/repository', $installation->repository());
        File::copyDirectory(base_path('.docker/helper'), $installation->repository().'/.docker/helper');
        File::copyDirectory(base_path('.docker/updater'), $installation->repository().'/.docker/updater');
        File::copyDirectory(base_path('scripts/lib'), $installation->repository().'/scripts/lib');
        File::copy(__DIR__.'/installation.env', $installation->root().'/.env');
        File::copy(base_path('.docker/updater/loop.sh'), "{$installation->folder}/state/journal-updater");
        File::put("{$installation->folder}/state/release.key", 'stand-in');
        $installation->git('init', '--quiet', '--initial-branch', self::BRANCH);
        $installation->commit();

        return $installation;
    }

    /**
     * Commits the files, each a path in the repository and its content, as the branch's newest commit.
     *
     * @param  array<string, string>  $files
     */
    public function push(array $files): string
    {
        foreach ($files as $path => $content) {
            File::ensureDirectoryExists(dirname("{$this->repository()}/{$path}"));
            File::put("{$this->repository()}/{$path}", $content);
        }

        return $this->commit();
    }

    /**
     * Commits the removal of the files, each a path in the repository, as the branch's newest commit.
     *
     * @param  list<string>  $paths
     */
    public function pushRemoval(array $paths): string
    {
        File::delete(array_map(fn (string $path) => "{$this->repository()}/{$path}", $paths));

        return $this->commit();
    }

    /**
     * Whether the installation folder holds the file, a path relative to it.
     */
    public function holdsFile(string $path): bool
    {
        return File::exists("{$this->root()}/{$path}");
    }

    /**
     * Runs the project's update script once, as the updater's loop does every minute.
     */
    public function update(): Process
    {
        return $this->run('update.sh');
    }

    /**
     * Runs one round of the updater's loop: the stand-in sleep ends it where it would wait a minute.
     */
    public function runLoopOnce(): Process
    {
        return $this->run('loop.sh');
    }

    /**
     * Runs the supervisor's heal step once, as the updater's loop does after each round, with no pause between tries.
     */
    public function heal(): Process
    {
        return $this->run('heal.sh', ['JOURNAL_HEAL_PAUSE_SECONDS' => '0']);
    }

    /**
     * Makes Docker list the installation's containers as given: each a service, its state, health and exit code.
     *
     * @param  list<array{Service: string, State: string, Health: string, ExitCode: int}>  $containers
     */
    public function containersAre(array $containers): void
    {
        File::put("{$this->folder}/stand-in/containers.json", json_encode($containers, JSON_THROW_ON_ERROR));
    }

    /**
     * Makes every step the supervisor runs again end with the exit code.
     */
    public function endStepsWith(int $code): void
    {
        File::put("{$this->folder}/stand-in/step-exit", (string) $code);
    }

    /**
     * What the installation could not heal, as the journal shows it.
     */
    public function faults(): string
    {
        return $this->recorded('storage/installation/faults');
    }

    /**
     * Whether a download was asked for whose address holds the part.
     */
    public function wasFetched(string $part): bool
    {
        $log = "{$this->folder}/stand-in/requests.log";

        return File::exists($log) && str_contains(File::get($log), $part);
    }

    /**
     * @param  array<string, string>  $environment
     */
    private function run(string $script, array $environment = []): Process
    {
        $update = new Process(['sh', base_path(".docker/updater/{$script}")], $this->root(), [
            'JOURNAL_ROOT' => $this->root(),
            'JOURNAL_BRANCH' => self::BRANCH,
            'JOURNAL_REPOSITORY' => $this->repository(),
            'JOURNAL_UPDATER_STATE' => "{$this->folder}/state",
            'JOURNAL_UPDATER_LOOP' => "{$this->folder}/state/journal-updater",
            ...$this->docker->environment(),
            ...$environment,
        ]);
        $update->run();

        return $update;
    }

    /**
     * The value .env gives the setting.
     */
    public function setting(string $name): string
    {
        return Dotenv::parse(File::get($this->root().'/.env'))[$name] ?? '';
    }

    /**
     * How many built images the installation's record holds.
     */
    public function recordedImages(): int
    {
        $record = json_decode(File::get($this->root().'/docs/accounts/docker-images.json'), true, 16, JSON_THROW_ON_ERROR);

        return count($record['images']);
    }

    /**
     * The secret the installation keeps for its contained host.
     */
    public function hostSecret(): string
    {
        return $this->recorded('secrets/journal_host_secret');
    }

    /**
     * The version file the app services mount: the commit, its branch and its tag, one per line.
     */
    public function installedVersion(): string
    {
        return $this->recorded('storage/installation/installed-version');
    }

    public function installedCommit(): string
    {
        return $this->recorded('.installed-commit');
    }

    public function failedCommit(): string
    {
        return $this->recorded('.failed-commit');
    }

    public function remove(): void
    {
        File::deleteDirectory($this->folder);
    }

    private function recorded(string $file): string
    {
        $path = "{$this->root()}/{$file}";

        return File::exists($path) ? trim(File::get($path)) : '';
    }

    private function commit(): string
    {
        $this->git('add', '--all');
        $this->git('commit', '--quiet', '--message', 'push');

        return trim($this->git('rev-parse', 'HEAD'));
    }

    private function git(string ...$arguments): string
    {
        $identity = ['-c', 'user.name=Test', '-c', 'user.email=test@journal.test'];
        $git = new Process(['git', ...$identity, ...$arguments], $this->repository());
        $git->mustRun();

        return $git->getOutput();
    }

    private function repository(): string
    {
        return "{$this->folder}/repository";
    }

    private function root(): string
    {
        return "{$this->folder}/installation";
    }
}
