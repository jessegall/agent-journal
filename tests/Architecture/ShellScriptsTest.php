<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Symfony\Component\Process\Process;
use Tests\TestCase;

/**
 * Every tracked shell script follows docs/shell-scripts.md: a header of at most three lines, a main of named steps
 * called on the last line, no comment longer than three lines, every variable a step sets local, and shell only.
 */
final class ShellScriptsTest extends TestCase
{
    public function test_every_tracked_shell_script_follows_the_standard(): void
    {
        $scripts = new Process(['git', 'ls-files', '*.sh'], base_path());
        $scripts->mustRun();
        $files = array_values(array_filter(explode("\n", $scripts->getOutput())));

        $faults = new Process([PHP_BINARY, 'tools/refactoring/shell-scripts.php', 'faults', ...$files], base_path());
        $faults->run();

        $this->assertSame(0, $faults->getExitCode(), $faults->getOutput().$faults->getErrorOutput());
    }
}
