<?php

declare(strict_types=1);

namespace Tests\Feature\Installation;

use Illuminate\Support\Facades\File;
use Symfony\Component\Process\Process;
use Tests\Support\Installation\StandInDocker;
use Tests\TestCase;

/**
 * The agent-images service's script (.docker/agent-images/load.sh) run for real against a stand-in agent daemon: it
 * loads the saved archives only when a pinned image is missing, keeps the pinned images and those a container runs
 * on, and fails with a plain line when the pins are unset or an archive does not hold a pinned image.
 */
final class AgentImagesTest extends TestCase
{
    private const string NO_RUNNER_IMAGE = 'The agent daemon holds no image ';

    private const string UNSET_PINS = 'Name AGENT_IMAGE and RUNNER_IMAGE';

    private const string AGENT = 'sha256:aaaa';

    private const string RUNNER = 'sha256:bbbb';

    private string $folder;

    private StandInDocker $docker;

    protected function setUp(): void
    {
        parent::setUp();

        $this->folder = (string) tempnam(sys_get_temp_dir(), 'agent-images');
        File::delete($this->folder);
        File::ensureDirectoryExists("{$this->folder}/stand-in");
        File::ensureDirectoryExists("{$this->folder}/images");
        File::put("{$this->folder}/stand-in/daemon-images", '');
        $this->docker = new StandInDocker("{$this->folder}/stand-in");
    }

    protected function tearDown(): void
    {
        File::deleteDirectory($this->folder);

        parent::tearDown();
    }

    public function test_pinned_images_already_held_load_no_archive(): void
    {
        $this->daemonHolds(self::AGENT, self::RUNNER);
        $this->archive('agent', 'aaaa');

        $run = $this->load(self::AGENT, self::RUNNER);

        $this->assertSame(0, $run->getExitCode(), $run->getErrorOutput());
        $this->assertSame([], $this->docker->callsHolding('load --quiet'));
    }

    public function test_a_missing_pin_loads_every_archive(): void
    {
        $this->archive('agent', 'aaaa');
        $this->archive('runner', 'bbbb');

        $run = $this->load(self::AGENT, self::RUNNER);

        $this->assertSame(0, $run->getExitCode(), $run->getErrorOutput());
        $this->assertCount(2, $this->docker->callsHolding('load --quiet'));
    }

    public function test_an_archive_without_the_pinned_image_fails_with_a_plain_line(): void
    {
        $this->archive('agent', 'aaaa');
        $this->archive('runner', 'cccc');

        $run = $this->load(self::AGENT, self::RUNNER);

        $this->assertSame(1, $run->getExitCode());
        $this->assertStringContainsString(self::NO_RUNNER_IMAGE.self::RUNNER, $run->getErrorOutput());
    }

    public function test_unset_pins_fail_before_any_docker_call(): void
    {
        $run = $this->load('', self::RUNNER);

        $this->assertSame(1, $run->getExitCode());
        $this->assertStringContainsString(self::UNSET_PINS, $run->getErrorOutput());
        $this->assertSame([], $this->docker->callsHolding(''));
    }

    public function test_an_old_image_goes_unless_a_container_still_runs_on_it(): void
    {
        $this->daemonHolds(self::AGENT, self::RUNNER, 'sha256:old', 'sha256:working');
        File::put("{$this->folder}/stand-in/images-in-use", "sha256:working\n");

        $run = $this->load(self::AGENT, self::RUNNER);

        $this->assertSame(0, $run->getExitCode(), $run->getErrorOutput());
        $this->assertSame(
            [self::AGENT, self::RUNNER, 'sha256:working'],
            array_values(array_filter(explode("\n", File::get("{$this->folder}/stand-in/daemon-images")))),
        );
    }

    private function load(string $agent, string $runner): Process
    {
        $process = new Process(['sh', base_path('.docker/agent-images/load.sh')], base_path(), [
            'AGENT_IMAGE' => $agent,
            'RUNNER_IMAGE' => $runner,
            'AGENT_IMAGE_ARCHIVES' => "{$this->folder}/images",
            ...$this->docker->environment(),
        ]);
        $process->run();

        return $process;
    }

    private function daemonHolds(string ...$images): void
    {
        File::put("{$this->folder}/stand-in/daemon-images", implode("\n", $images)."\n");
    }

    private function archive(string $name, string $digest): void
    {
        $manifest = "{$this->folder}/manifest.json";
        $content = [['Config' => "blobs/sha256/{$digest}", 'RepoTags' => ["{$name}:latest"]]];
        File::put($manifest, json_encode($content, JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR));
        new Process(['tar', '-cf', "{$this->folder}/images/{$name}.tar", '-C', $this->folder, 'manifest.json'])->mustRun();
    }
}
