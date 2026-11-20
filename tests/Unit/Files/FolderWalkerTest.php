<?php

declare(strict_types=1);

namespace Tests\Unit\Files;

use App\Files\Enums\EntryType;
use App\Files\Enums\Place;
use App\Files\Exceptions\FilePathInvalid;
use App\Files\Exceptions\FolderMissing;
use App\Files\Support\FolderWalker;
use App\Files\Values\Depth;
use App\Files\Values\FilePath;
use App\Files\Values\FolderEntry;
use Illuminate\Filesystem\Filesystem;
use Tests\TestCase;

/**
 * A list gives one level unless more is asked, never more than asked; links are listed and not entered, closed
 * folders are left out, and a pattern matches one name per '*'.
 */
final class FolderWalkerTest extends TestCase
{
    private string $folder;

    protected function setUp(): void
    {
        parent::setUp();

        $this->folder = sys_get_temp_dir().'/folder-walker-'.bin2hex(random_bytes(6));

        foreach (['sub/deeper', 'l1/l2/l3/l4/l5', 'empty', '.git', 'vendor/pkg', 'mods/One/Console', 'mods/é "q" two/Console', 'mods/Three'] as $path) {
            mkdir("{$this->folder}/{$path}", 0o700, true);
        }

        foreach (['a.php', 'b.txt', '.hidden', 'sub/c.php', 'sub/deeper/d.php', 'l1/l2/l3/l4/l5/f.txt', 'mods/One/Console/Run.php', 'mods/é "q" two/Console/Say it.php', 'mods/Three/Other.php'] as $path) {
            file_put_contents("{$this->folder}/{$path}", 'x');
        }

        config(['files.places.project' => $this->folder]);
    }

    protected function tearDown(): void
    {
        new Filesystem()->deleteDirectory($this->folder);

        parent::tearDown();
    }

    public function test_one_level_is_the_folders_own_entries_sorted_without_dot_entries_or_closed_folders(): void
    {
        $this->assertSame(
            ['.hidden', 'a.php', 'b.txt', 'empty', 'l1', 'mods', 'sub'],
            $this->relativePaths($this->walker()->walk($this->path(''), Depth::one(), '*')),
        );
    }

    public function test_a_name_pattern_keeps_the_matching_entries_of_the_level(): void
    {
        $this->assertSame(['a.php'], $this->relativePaths($this->walker()->walk($this->path(''), Depth::one(), '*.php')));
        $this->assertSame(
            ['a.php', 'mods/Three/Other.php', 'sub/c.php', 'sub/deeper/d.php'],
            $this->relativePaths($this->walker()->walk($this->path(''), Depth::levels(3), '*.php')),
        );
    }

    public function test_the_depth_asked_is_the_depth_walked(): void
    {
        $entries = $this->relativePaths($this->walker()->walk($this->path('l1'), Depth::levels(3), '*'));

        $this->assertSame(['l1/l2', 'l1/l2/l3', 'l1/l2/l3/l4'], $entries);
    }

    public function test_a_link_to_a_folder_is_listed_as_a_link_and_not_entered(): void
    {
        symlink("{$this->folder}/sub", "{$this->folder}/linked");

        $entries = iterator_to_array($this->walker()->walk($this->path(''), Depth::levels(3), '*'));
        $linked = array_values(array_filter($entries, fn (FolderEntry $entry) => $entry->path->relative === 'linked'));

        $this->assertSame(EntryType::Link, $linked[0]->type);
        $this->assertNotContains('linked/c.php', array_map(fn (FolderEntry $entry) => $entry->path->relative, $entries));
    }

    public function test_links_leading_round_in_a_loop_are_listed_and_the_walk_stops(): void
    {
        symlink("{$this->folder}/empty/b", "{$this->folder}/empty/a");
        symlink("{$this->folder}/empty/a", "{$this->folder}/empty/b");

        $entries = iterator_to_array($this->walker()->walk($this->path('empty'), Depth::levels(16), '*'));

        $this->assertSame([EntryType::Link, EntryType::Link], array_map(fn (FolderEntry $entry) => $entry->type, $entries));
    }

    public function test_an_empty_folder_lists_as_empty_and_a_missing_one_is_refused(): void
    {
        $this->assertTrue($this->walker()->walk($this->path('empty'), Depth::one(), '*')->isEmpty());
        $this->expectExceptionObject(FolderMissing::at($this->path('none')->label()));

        $this->walker()->walk($this->path('none'), Depth::one(), '*');
    }

    public function test_each_entry_says_what_it_is_and_carries_its_fingerprint(): void
    {
        $entries = iterator_to_array($this->walker()->walk($this->path('sub'), Depth::one(), '*'));

        $this->assertSame([EntryType::File, EntryType::Folder], array_map(fn (FolderEntry $entry) => $entry->type, $entries));
        $this->assertSame(1, $entries[0]->fingerprint->size);
    }

    public function test_a_pattern_matches_one_name_per_star_with_spaces_quotes_and_accents(): void
    {
        $this->assertSame(
            ['mods/One/Console/Run.php', 'mods/é "q" two/Console/Say it.php'],
            $this->relativePaths($this->walker()->expand($this->path('mods/*/Console/*.php'))),
        );
        $this->assertSame(['sub/c.php'], $this->relativePaths($this->walker()->expand($this->path('*/c.php'))));
    }

    public function test_a_pattern_does_not_enter_a_link_or_a_closed_folder(): void
    {
        symlink("{$this->folder}/sub", "{$this->folder}/linked");

        $this->assertSame(['sub/c.php'], $this->relativePaths($this->walker()->expand($this->path('*/c.php'))));
        $this->assertSame([], $this->relativePaths($this->walker()->expand($this->path('vendor/*'))));
    }

    public function test_a_double_star_pattern_is_refused(): void
    {
        $this->expectExceptionObject(FilePathInvalid::recursivePattern('mods/**/Run.php'));

        $this->walker()->expand($this->path('mods/**/Run.php'));
    }

    private function path(string $relative): FilePath
    {
        return FilePath::in(Place::Project, $relative);
    }

    private function walker(): FolderWalker
    {
        return $this->app->make(FolderWalker::class);
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
