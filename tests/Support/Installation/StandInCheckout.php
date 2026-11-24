<?php

declare(strict_types=1);

namespace Tests\Support\Installation;

use Dotenv\Dotenv;
use Illuminate\Support\Facades\File;
use Symfony\Component\Process\Process;

/**
 * A developer's checkout in a temporary folder, a real git repository holding the project's own local host scripts
 * and the agent image's folder, whose Docker and Go are stand-ins: scripts/local-host.sh runs in it for real and
 * reaches no real Docker.
 */
final readonly class StandInCheckout
{
    private const array SCRIPTS = [
        'scripts/local-host.sh',
        'scripts/dev-watch-host.sh',
        'scripts/prepare-hook-test-database.sh',
    ];

    private const array FOLDERS = ['scripts/lib', 'scripts/local-host', '.docker/helper'];

    // What the scripts write into the checkout and git does not hold, as in the project's own .gitignore.
    private const string IGNORED = ".env*\n/images\n/.build\n/secrets\n";

    public StandInDocker $docker;

    private function __construct(private string $folder)
    {
        $this->docker = new StandInDocker("{$folder}/stand-in");
    }

    /**
     * A checkout with every file committed and nothing set up yet: no image, no contained settings, no host.
     */
    public static function withLocalHostScripts(): self
    {
        $token = getenv('TEST_TOKEN') ?: 'alone';
        $checkout = new self(sys_get_temp_dir()."/checkout-{$token}-".bin2hex(random_bytes(6)));

        foreach (['checkout', 'stand-in', 'home'] as $part) {
            File::makeDirectory("{$checkout->folder}/{$part}", 0o755, true);
        }

        foreach (self::SCRIPTS as $script) {
            File::ensureDirectoryExists(dirname($checkout->path($script)));
            File::copy(base_path($script), $checkout->path($script));
        }

        foreach (self::FOLDERS as $folder) {
            File::copyDirectory(base_path($folder), $checkout->path($folder));
        }

        $checkout->write('tools/journal-check/main.go', "package main\n");
        $checkout->write('tools/journal-agent/cmd/journal-agent/main.go', "package main\n");
        $checkout->write('docs/accounts/docker-images.json', "{\"images\": []}\n");
        $checkout->write('.gitignore', self::IGNORED);
        $checkout->write('.env', "APP_PORT=54700\n");
        $checkout->git('init', '--quiet');
        $checkout->git('add', '--all');
        $checkout->git('commit', '--quiet', '--message', 'checkout');

        return $checkout;
    }

    /**
     * Runs scripts/local-host.sh with the options given, as a developer does from the checkout's root.
     */
    public function runLocalHost(string ...$options): Process
    {
        $run = new Process(['sh', 'scripts/local-host.sh', ...$options], $this->path(''), [
            ...$this->docker->environment(),
            'HOME' => "{$this->folder}/home",
        ]);
        $run->run();

        return $run;
    }

    /**
     * Writes a file of the checkout, left uncommitted as a developer's change is.
     */
    public function write(string $path, string $content): void
    {
        File::ensureDirectoryExists(dirname($this->path($path)));
        File::put($this->path($path), $content);
    }

    /**
     * Makes the database forget every host, as a database made again does.
     */
    public function forgetHosts(): void
    {
        File::put("{$this->docker->folder}/host-gone", '');
    }

    /**
     * The value the checkout's .env gives the setting, or nothing.
     */
    public function setting(string $name): string
    {
        return Dotenv::parse(File::get($this->path('.env')))[$name] ?? '';
    }

    public function hostSecret(): string
    {
        return trim(File::get($this->path('secrets/journal_host_secret')));
    }

    /**
     * Every build the stand-in Go was asked for, with its arguments.
     *
     * @return list<string>
     */
    public function goBuilds(): array
    {
        return array_values(array_filter(explode("\n", File::get("{$this->docker->folder}/go-calls.log"))));
    }

    public function remove(): void
    {
        File::deleteDirectory($this->folder);
    }

    private function path(string $path): string
    {
        return rtrim("{$this->folder}/checkout/{$path}", '/');
    }

    private function git(string ...$arguments): void
    {
        $identity = ['-c', 'user.name=Test', '-c', 'user.email=test@journal.test'];
        new Process(['git', ...$identity, ...$arguments], $this->path(''))->mustRun();
    }
}
