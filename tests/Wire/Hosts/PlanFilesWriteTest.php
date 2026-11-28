<?php

declare(strict_types=1);

namespace Tests\Wire\Hosts;

use App\Agents\ContainerManifest;
use App\Support\TarArchive;
use App\Support\TarFile;
use Illuminate\Support\Facades\File;
use Symfony\Component\Process\Process;
use Tests\Support\Entries\Attributes\OverTheWire;
use Tests\TestCase;

/**
 * resources/host-scripts/plan-files-write.sh run for real, as root as its helper container runs it: each plan file
 * keeps the owner and mode its tar gives it, so a seal's key is the program's alone and every other file is shared.
 */
#[OverTheWire]
final class PlanFilesWriteTest extends TestCase
{
    private string $session;

    protected function setUp(): void
    {
        parent::setUp();

        $this->session = sys_get_temp_dir().'/plan-files-'.bin2hex(random_bytes(6));
        File::makeDirectory($this->session);
    }

    protected function tearDown(): void
    {
        File::deleteDirectory($this->session);

        parent::tearDown();
    }

    public function test_a_key_only_the_program_may_read_is_written_its_own_and_the_rest_shared(): void
    {
        $folder = "{$this->session}/process/files";
        $archive = TarArchive::of(
            TarFile::shared('hook-replies.json', '{"seal":"x"}'),
            TarFile::privateTo((int) ContainerManifest::DRIVER_USER, 'hook-replies.key', 'secret'),
        );

        $write = new Process(['sh', base_path('resources/host-scripts/plan-files-write.sh'), $folder, $this->session]);
        $write->setInput($archive)->mustRun();
        $owners = new Process(['stat', '-c', '%n %u %a', "{$folder}/hook-replies.json", "{$folder}/hook-replies.key"]);

        $this->assertSame(
            ["{$folder}/hook-replies.json 0 644", "{$folder}/hook-replies.key 10001 400"],
            explode("\n", trim($owners->mustRun()->getOutput())),
        );
    }
}
