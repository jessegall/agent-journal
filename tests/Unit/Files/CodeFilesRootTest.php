<?php

declare(strict_types=1);

namespace Tests\Unit\Files;

use App\Support\CodeFiles;
use Tests\TestCase;

/**
 * Foundation permissions and discovery roots: the process's code reads cover the application's base path as
 * bootstrap/app.php names it, not a path worked out from where CodeFiles itself sits, and a fixture root still
 * overrides.
 */
final class CodeFilesRootTest extends TestCase
{
    public function test_the_process_reads_cover_the_application_base_path_and_a_fixture_root_overrides(): void
    {
        $fixture = base_path('tests/Fixtures');

        $this->assertSame('app/CoreCommands.php', CodeFiles::ofProcess()->projectPathOf(base_path('app/CoreCommands.php'))->relative);
        $this->assertSame('Listeners', CodeFiles::over($fixture)->projectPathOf("{$fixture}/Listeners")->relative);
    }
}
