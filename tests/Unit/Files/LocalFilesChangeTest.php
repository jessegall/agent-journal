<?php

declare(strict_types=1);

namespace Tests\Unit\Files;

use App\Contracts\Files\Files;
use App\Enums\Files\Place;
use App\Exceptions\FolderTooDeep;
use App\Exceptions\LinkLeavesPlace;
use App\Values\Depth;
use App\Values\FilePath;
use RuntimeException;
use Tests\Support\Files\UsesTemporaryPlaces;
use Tests\TestCase;

/**
 * The funnel removes files and bounded folder trees without following links, links and moves within a place, holds a
 * lock for the length of a closure, and removes a scratch file however its work ends.
 */
final class LocalFilesChangeTest extends TestCase
{
    use UsesTemporaryPlaces;

    private string $project;

    private string $temporary;

    protected function setUp(): void
    {
        parent::setUp();

        $this->project = $this->placeInTemporaryFolder(Place::Project);
        $this->temporary = $this->placeInTemporaryFolder(Place::Temporary);
    }

    public function test_deleting_a_missing_file_is_no_failure(): void
    {
        $this->files()->delete($this->path('none.json'));

        $this->assertFileDoesNotExist("{$this->project}/none.json");
    }

    public function test_deleting_a_link_removes_the_link_and_never_its_target(): void
    {
        file_put_contents("{$this->project}/target.txt", 'kept');
        symlink("{$this->project}/target.txt", "{$this->project}/pointer");

        $this->files()->delete($this->path('pointer'));

        $this->assertFalse(is_link("{$this->project}/pointer"));
        $this->assertSame('kept', file_get_contents("{$this->project}/target.txt"));
    }

    public function test_a_tree_deeper_than_its_depth_is_refused_before_anything_is_removed(): void
    {
        mkdir("{$this->project}/staged/one/two/three", 0o755, true);
        file_put_contents("{$this->project}/staged/top.md", 'x');

        $this->expectExceptionObject(FolderTooDeep::at($this->path('staged')->label(), 2));

        try {
            $this->files()->deleteFolder($this->path('staged'), Depth::levels(2));
        } finally {
            $this->assertFileExists("{$this->project}/staged/top.md");
        }
    }

    public function test_a_tree_is_removed_and_a_link_inside_it_is_removed_as_a_link(): void
    {
        mkdir("{$this->project}/staged/skills/one", 0o755, true);
        mkdir("{$this->project}/elsewhere");
        file_put_contents("{$this->project}/elsewhere/keep.md", 'kept');
        file_put_contents("{$this->project}/staged/skills/one/SKILL.md", 'x');
        symlink("{$this->project}/elsewhere", "{$this->project}/staged/skills/linked");

        $this->files()->deleteFolder($this->path('staged'), Depth::levels(3));

        $this->assertDirectoryDoesNotExist("{$this->project}/staged");
        $this->assertSame('kept', file_get_contents("{$this->project}/elsewhere/keep.md"));
    }

    public function test_a_link_to_another_place_is_refused(): void
    {
        file_put_contents("{$this->temporary}/x.txt", 'x');

        $this->expectExceptionObject(LinkLeavesPlace::from($this->path('pointer')->label()));

        $this->files()->link($this->path('pointer'), FilePath::in(Place::Temporary, 'x.txt'));
    }

    public function test_a_link_then_a_move_swaps_the_active_link_in_one_step(): void
    {
        mkdir("{$this->project}/generation-1");
        mkdir("{$this->project}/generation-2");
        symlink("{$this->project}/generation-1", "{$this->project}/active");

        $this->files()->link($this->path('active.next'), $this->path('generation-2'));
        $this->files()->move($this->path('active.next'), $this->path('active'));

        $this->assertSame(realpath("{$this->project}/generation-2"), readlink("{$this->project}/active"));
        $this->assertFalse(is_link("{$this->project}/active.next"));
    }

    public function test_a_lock_is_released_after_its_work_throws_and_a_read_inside_it_is_allowed(): void
    {
        file_put_contents("{$this->project}/config.toml", 'current');

        $read = $this->files()->locked(
            $this->path('config.toml.lock'),
            fn () => $this->files()->read($this->path('config.toml')),
        );
        $this->assertSame('current', $read);

        $this->assertThrows(
            fn () => $this->files()->locked($this->path('config.toml.lock'), fn () => throw new RuntimeException('failed')),
            RuntimeException::class,
        );

        $handle = fopen("{$this->project}/config.toml.lock", 'c');
        $this->assertTrue(flock($handle, LOCK_EX | LOCK_NB));
        fclose($handle);
    }

    public function test_a_scratch_file_is_removed_even_when_its_work_throws(): void
    {
        $scratch = null;

        $this->assertThrows(function () use (&$scratch) {
            $this->files()->scratch(function (FilePath $file) use (&$scratch) {
                $scratch = $file;
                $this->files()->write($file, 'draft');

                throw new RuntimeException('failed');
            });
        }, RuntimeException::class);

        $this->assertInstanceOf(FilePath::class, $scratch);
        $this->assertSame(Place::Temporary, $scratch->place);
        $this->assertFileDoesNotExist("{$this->temporary}/{$scratch->relative}");
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
