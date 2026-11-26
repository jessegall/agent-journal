<?php

declare(strict_types=1);

namespace Tests\Unit\Files;

use App\Exceptions\FileReadReentered;
use App\Exceptions\FolderMissing;
use App\Exceptions\PlaceUnavailable;
use App\Files\Enums\Place;
use App\Files\Values\Depth;
use App\Navigation\Exceptions\FolderClosed;
use App\Support\Files;
use App\Support\Reflector;
use App\Values\FilePath;
use App\Values\FolderEntry;
use Illuminate\Filesystem\Filesystem;
use Tests\TestCase;

/**
 * Files lists one level unless more is asked, matches a pattern one name per '*', refuses a closed folder named
 * directly and a list inside a read, and reports the free space of a place.
 */
final class LocalFilesListTest extends TestCase
{
    private string $folder;

    private Files $files;

    protected function setUp(): void
    {
        parent::setUp();

        $this->folder = sys_get_temp_dir().'/local-files-list-'.bin2hex(random_bytes(6));
        mkdir("{$this->folder}/app/Tasks/Console", 0o700, true);
        mkdir("{$this->folder}/.git", 0o700, true);
        file_put_contents("{$this->folder}/app/Tasks/Console/Close.php", 'x');
        file_put_contents("{$this->folder}/app/Tasks/Task.php", 'x');
        file_put_contents("{$this->folder}/app/readme.md", 'x');
        config(['files.places.project' => $this->folder, 'files.places.releases' => null]);
        $this->files = $this->app->make(Files::class);
    }

    protected function tearDown(): void
    {
        new Filesystem()->deleteDirectory($this->folder);

        parent::tearDown();
    }

    public function test_a_list_gives_one_level_unless_more_is_asked(): void
    {
        $this->assertSame(['app/Tasks', 'app/readme.md'], $this->relativePaths($this->files->list($this->path('app'))));
        $this->assertSame(
            ['app/Tasks/Console/Close.php', 'app/Tasks/Task.php'],
            $this->relativePaths($this->files->list($this->path('app'), Depth::levels(3), '*.php')),
        );
    }

    public function test_a_pattern_matches_one_name_per_star(): void
    {
        $this->assertSame(
            ['app/Tasks/Console/Close.php'],
            $this->relativePaths($this->files->matching($this->path('app/*/Console/*.php'))),
        );
    }

    public function test_a_closed_folder_named_directly_is_refused(): void
    {
        $this->expectExceptionObject(FolderClosed::at('.git'));

        $this->files->list($this->path('.git'));
    }

    public function test_a_missing_folder_is_refused_by_name(): void
    {
        $this->expectExceptionObject(FolderMissing::at($this->path('none')->label()));

        $this->files->list($this->path('none'));
    }

    public function test_a_list_or_pattern_inside_a_read_is_refused(): void
    {
        $whileReading = Reflector::of(Files::class)->method('whileReading');
        $outer = $this->path('app/readme.md');

        $this->assertThrows(
            fn () => $whileReading->invokeOn($this->files, $outer, fn () => $this->files->list($this->path('app'))),
            FileReadReentered::class,
        );
        $this->assertThrows(
            fn () => $whileReading->invokeOn($this->files, $outer, fn () => $this->files->matching($this->path('app/*'))),
            FileReadReentered::class,
        );
    }

    public function test_free_space_is_reported_for_a_place_and_refused_for_one_without_a_root(): void
    {
        $this->assertGreaterThan(0, $this->files->freeSpace(Place::Project));
        $this->expectExceptionObject(PlaceUnavailable::for(Place::Releases));

        $this->files->freeSpace(Place::Releases);
    }

    private function path(string $relative): FilePath
    {
        return FilePath::in(Place::Project, $relative);
    }

    /**
     * @param  iterable<FolderEntry>  $entries
     * @return list<string>
     */
    private function relativePaths(iterable $entries): array
    {
        $paths = [];

        foreach ($entries as $entry) {
            $paths[] = $entry->path->relative;
        }

        return $paths;
    }
}
