<?php

declare(strict_types=1);

namespace Tests\Unit\Files;

use App\Agents\Exceptions\FileExists;
use App\Agents\Exceptions\FileUnwritable;
use App\Files\Contracts\Files;
use App\Files\Enums\Permissions;
use App\Files\Enums\Place;
use App\Navigation\Exceptions\FolderClosed;
use App\Navigation\Exceptions\LinkLeavesPlace;
use App\Values\FilePath;
use Carbon\CarbonImmutable;
use Tests\Support\Files\UsesTemporaryPlaces;
use Tests\TestCase;

/**
 * The funnel writes whole files atomically with their mode from the start, creates only where nothing is, appends
 * under a lock, makes missing folders with the place's mode, and refuses closed folders and links out of the place.
 */
final class LocalFilesWriteTest extends TestCase
{
    use UsesTemporaryPlaces;

    private const string APPENDED_LOG = "one\ntwo\n";

    private string $project;

    private string $secrets;

    protected function setUp(): void
    {
        parent::setUp();

        $this->project = $this->placeInTemporaryFolder(Place::Project);
        $this->secrets = $this->placeInTemporaryFolder(Place::SharingSecrets);
        mkdir("{$this->project}/vendor");
        CarbonImmutable::setTestNow(CarbonImmutable::now()->addMinute());
    }

    protected function tearDown(): void
    {
        CarbonImmutable::setTestNow();

        parent::tearDown();
    }

    public function test_a_whole_file_write_replaces_the_file_and_leaves_no_temporary_file(): void
    {
        file_put_contents("{$this->project}/manifest.json", 'old');

        $this->files()->write($this->path('manifest.json'), 'new');

        $this->assertSame('new', file_get_contents("{$this->project}/manifest.json"));
        $this->assertSame(['manifest.json', 'vendor'], array_values(array_diff(scandir($this->project) ?: [], ['.', '..'])));
        $this->assertSame(0o644, fileperms("{$this->project}/manifest.json") & 0o777);
    }

    public function test_a_read_after_a_write_sees_the_write(): void
    {
        file_put_contents("{$this->project}/manifest.json", '{"a": 1}');
        $this->assertSame(['a' => 1], $this->files()->readJson($this->path('manifest.json')));

        $this->files()->write($this->path('manifest.json'), '{"a": 2}');

        $this->assertSame(['a' => 2], $this->files()->readJson($this->path('manifest.json')));
    }

    public function test_a_secret_is_written_readable_by_its_owner_only(): void
    {
        $this->files()->write(FilePath::in(Place::SharingSecrets, 'gateway-token'), 'secret', Permissions::OwnerOnly);

        $this->assertSame(0o600, fileperms("{$this->secrets}/gateway-token") & 0o777);
    }

    public function test_a_create_only_write_refuses_an_existing_file_and_leaves_it(): void
    {
        $this->files()->create($this->path('chunk'), 'first');

        try {
            $this->files()->create($this->path('chunk'), 'second');
            $this->fail('An existing file was overwritten.');
        } catch (FileExists $refusal) {
            $this->assertEquals(FileExists::at($this->path('chunk')->label()), $refusal);
        }

        $this->assertSame('first', file_get_contents("{$this->project}/chunk"));
    }

    public function test_lines_are_appended_in_turn(): void
    {
        $this->files()->append($this->path('log/bypass.log'), "one\n");
        $this->files()->append($this->path('log/bypass.log'), "two\n");

        $this->assertSame(self::APPENDED_LOG, file_get_contents("{$this->project}/log/bypass.log"));
    }

    public function test_missing_folders_are_made_with_the_place_mode(): void
    {
        $this->files()->write(FilePath::in(Place::SharingSecrets, 'tunnels/ngrok/token'), 'x', Permissions::OwnerOnly);
        $this->files()->makeFolder($this->path('public/build'), Permissions::Shared);

        $this->assertSame(0o700, fileperms("{$this->secrets}/tunnels") & 0o777);
        $this->assertSame(0o755, fileperms("{$this->project}/public/build") & 0o777);
    }

    public function test_a_write_into_a_closed_folder_is_refused_and_nothing_is_made(): void
    {
        $this->assertThrows(fn () => $this->files()->write($this->path('vendor/x.php'), 'x'), FolderClosed::class);

        $this->assertFileDoesNotExist("{$this->project}/vendor/x.php");
    }

    public function test_a_write_through_a_folder_linking_out_of_the_place_is_refused_before_any_byte(): void
    {
        $outside = sys_get_temp_dir().'/outside-'.bin2hex(random_bytes(6));
        mkdir($outside);
        symlink($outside, "{$this->project}/out");

        try {
            $this->assertThrows(fn () => $this->files()->write($this->path('out/x'), 'x'), LinkLeavesPlace::class);
            $this->assertSame([], array_values(array_diff(scandir($outside) ?: [], ['.', '..'])));
        } finally {
            rmdir($outside);
        }
    }

    public function test_a_failed_write_leaves_the_old_file_and_no_temporary_file(): void
    {
        if (posix_geteuid() === 0) {
            $this->markTestSkipped('The root user writes into a folder of mode 0500.');
        }

        mkdir("{$this->project}/locked");
        file_put_contents("{$this->project}/locked/a.txt", 'old');
        chmod("{$this->project}/locked", 0o500);

        try {
            $this->assertThrows(fn () => $this->files()->write($this->path('locked/a.txt'), 'new'), FileUnwritable::class);
            $this->assertSame('old', file_get_contents("{$this->project}/locked/a.txt"));
            $this->assertSame(['a.txt'], array_values(array_diff(scandir("{$this->project}/locked") ?: [], ['.', '..'])));
        } finally {
            chmod("{$this->project}/locked", 0o700);
        }
    }

    private function files(): Files
    {
        return $this->app->make(Files::class);
    }

    private function path(string $relative): FilePath
    {
        return FilePath::in(Place::Project, $relative);
    }
}
