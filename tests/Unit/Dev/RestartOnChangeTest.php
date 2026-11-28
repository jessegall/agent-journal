<?php

declare(strict_types=1);

namespace Tests\Unit\Dev;

use Symfony\Component\Process\Process;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * In development every long-lived PHP process runs under .docker/dev/restart-on-change.sh, which starts it again once
 * a PHP file of the project changes, so no change waits on a hand restart.
 */
#[TimeLimit(seconds: 20, reason: 'It runs the watcher script against a command and waits for its polls.')]
final class RestartOnChangeTest extends TestCase
{
    public function test_a_changed_php_file_starts_the_command_again(): void
    {
        $folder = sys_get_temp_dir().'/restart-on-change-'.bin2hex(random_bytes(4));
        mkdir("{$folder}/app", recursive: true);
        touch("{$folder}/app/Example.php", time() - 60);
        touch("{$folder}/composer.lock", time() - 60);
        $watcher = new Process(
            ['sh', base_path('.docker/dev/restart-on-change.sh'), 'sh', '-c', 'echo started >> starts.log; sleep 60'],
            $folder,
            ['POLL_SECONDS' => '1'],
        );
        $watcher->start();
        $this->waitForStarts($folder, 1);

        touch("{$folder}/app/Example.php");
        $this->waitForStarts($folder, 2);
        $watcher->signal(SIGTERM);
        $watcher->wait();

        $this->assertSame(2, $this->startsIn($folder));
    }

    private function waitForStarts(string $folder, int $starts): void
    {
        $deadline = microtime(true) + 10;

        while ($this->startsIn($folder) < $starts && microtime(true) < $deadline) {
            usleep(100_000);
        }
    }

    private function startsIn(string $folder): int
    {
        $log = "{$folder}/starts.log";

        return is_file($log) ? substr_count((string) file_get_contents($log), 'started') : 0;
    }
}
