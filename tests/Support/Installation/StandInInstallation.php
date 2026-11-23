<?php

declare(strict_types=1);

namespace Tests\Support\Installation;

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

    private const string BUILD_CALL = 'buildx build';

    private const string BUILD_TAG = '--tag journal-%s:build';

    private function __construct(private string $folder) {}

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
     * Whether a download was asked for whose address holds the part.
     */
    public function wasFetched(string $part): bool
    {
        $log = "{$this->folder}/stand-in/requests.log";

        return File::exists($log) && str_contains(File::get($log), $part);
    }

    private function run(string $script): Process
    {
        $update = new Process(['sh', base_path(".docker/updater/{$script}")], $this->root(), [
            'JOURNAL_ROOT' => $this->root(),
            'JOURNAL_BRANCH' => self::BRANCH,
            'JOURNAL_REPOSITORY' => $this->repository(),
            'JOURNAL_UPDATER_STATE' => "{$this->folder}/state",
            'JOURNAL_UPDATER_LOOP' => "{$this->folder}/state/journal-updater",
            'STAND_IN' => "{$this->folder}/stand-in",
            'PATH' => __DIR__.'/bin:'.getenv('PATH'),
        ]);
        $update->run();

        return $update;
    }

    /**
     * Makes every later Docker call that holds the part fail.
     */
    public function failCallsHolding(string $part): void
    {
        File::append("{$this->folder}/stand-in/failing", $part."\n");
    }

    /**
     * Makes every later build come out of Docker's cache: the same image as the build before it.
     */
    public function buildFromCache(): void
    {
        File::put("{$this->folder}/stand-in/cached", '');
    }

    public function hasBuilt(string $image): bool
    {
        $tag = sprintf(self::BUILD_TAG, $image);

        return array_any(
            $this->calls(),
            fn (string $call): bool => str_starts_with($call, self::BUILD_CALL) && str_contains($call, $tag),
        );
    }

    /**
     * Whether Docker was asked for something that holds every part given, in one call.
     */
    public function wasAsked(string ...$parts): bool
    {
        return array_any(
            $this->calls(),
            fn (string $call): bool => array_all($parts, fn (string $part): bool => str_contains($call, $part)),
        );
    }

    /**
     * Forgets the calls so far, so a test reads only those of its next update.
     */
    public function forgetCalls(): void
    {
        File::delete("{$this->folder}/stand-in/calls.log");
    }

    /**
     * @return list<string>
     */
    public function calls(): array
    {
        $log = "{$this->folder}/stand-in/calls.log";

        return File::exists($log) ? array_values(array_filter(explode("\n", File::get($log)))) : [];
    }

    /**
     * The value .env gives the setting.
     */
    public function setting(string $name): string
    {
        $line = array_find(
            explode("\n", File::get($this->root().'/.env')),
            fn (string $line): bool => str_starts_with($line, $name.'='),
        );

        return substr((string) $line, strlen($name) + 1);
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
