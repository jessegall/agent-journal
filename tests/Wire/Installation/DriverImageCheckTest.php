<?php

declare(strict_types=1);

namespace Tests\Wire\Installation;

use Illuminate\Support\Facades\File;
use Symfony\Component\Process\Process;
use Tests\Support\Entries\Attributes\OverTheWire;
use Tests\TestCase;

/**
 * .docker/helper/checks/driver-image.sh run for real against mock programs, as a driver image runs it as its last
 * build step: a sound image passes, and each fault fails the check by name.
 */
#[OverTheWire]
final class DriverImageCheckTest extends TestCase
{
    private string $folder;

    protected function setUp(): void
    {
        parent::setUp();

        $this->folder = sys_get_temp_dir().'/driver-image-'.bin2hex(random_bytes(6));
        File::makeDirectory("{$this->folder}/bin", 0o755, true);
        File::makeDirectory("{$this->folder}/policies");
        $this->program('codex', 'echo "codex-cli 0.165.0"');
        $this->program('codex-code-mode-host', 'true');
        File::put("{$this->folder}/programs.txt", "{$this->folder}/bin/codex\n{$this->folder}/bin/codex-code-mode-host\n");
        File::put("{$this->folder}/policies/config.toml", "[mcp_servers.journal]\n");
        File::chmod("{$this->folder}/policies/config.toml", 0o444);
    }

    protected function tearDown(): void
    {
        File::deleteDirectory($this->folder);

        parent::tearDown();
    }

    public function test_a_sound_image_passes_and_each_fault_fails_by_name(): void
    {
        $results = ['sound' => $this->check()];

        File::delete("{$this->folder}/bin/codex-code-mode-host");
        $results['missing program'] = $this->check();
        $this->program('codex-code-mode-host', 'true');

        $this->program('codex', 'exit 3');
        $results['version exits non-zero'] = $this->check();
        $this->program('codex', 'echo "codex-cli 0.166.0"');
        $results['another version'] = $this->check();
        $this->program('codex', 'echo "codex-cli 0.165.0"');

        $this->program('claude', 'true');
        $results['other driver'] = $this->check();
        File::delete("{$this->folder}/bin/claude");

        $this->program('node', 'true');
        $results['node'] = $this->check();
        File::delete("{$this->folder}/bin/node");

        File::chmod("{$this->folder}/policies/config.toml", 0o644);
        $results['writable policy'] = $this->check();

        $this->assertSame(
            [
                'sound' => '',
                'missing program' => "driver-image: {$this->folder}/bin/codex-code-mode-host is missing or not runnable",
                'version exits non-zero' => 'driver-image: codex --version exited non-zero',
                'another version' => 'driver-image: codex prints 0.166.0, not 0.165.0',
                'other driver' => 'driver-image: the image holds claude as well',
                'node' => 'driver-image: the image holds Node',
                'writable policy' => "driver-image: {$this->folder}/policies/config.toml is not root's and read-only",
            ],
            $results,
        );
    }

    /**
     * Runs the check as Codex's image does and answers the line it failed on, empty when it passed.
     */
    private function check(): string
    {
        $check = new Process(
            [
                'sh',
                base_path('.docker/helper/checks/driver-image.sh'),
                'codex',
                '2',
                '0.165.0',
                "{$this->folder}/programs.txt",
                "{$this->folder}/policies",
                '--',
                'claude',
            ],
            env: ['PATH' => "{$this->folder}/bin:/usr/bin:/bin"],
        );
        $check->run();

        return trim($check->getErrorOutput());
    }

    private function program(string $name, string $body): void
    {
        File::put("{$this->folder}/bin/{$name}", "#!/bin/sh\n{$body}\n");
        File::chmod("{$this->folder}/bin/{$name}", 0o755);
    }
}
