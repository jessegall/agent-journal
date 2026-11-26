<?php

declare(strict_types=1);

namespace Tests\Unit\Files;

use App\Exceptions\FileMissing;
use App\Files\Enums\Place;
use App\Files\PathConfinement;
use App\Navigation\Exceptions\FolderClosed;
use App\Navigation\Exceptions\LinkLeavesPlace;
use App\Navigation\Exceptions\LinkLoop;
use App\Values\FilePath;
use Illuminate\Filesystem\Filesystem;
use Tests\TestCase;

/**
 * A path resolves inside its place: a link out, a link loop, a closed folder and a file swapped after its check are
 * each refused by name, and a link inside the place is followed.
 */
final class PathConfinementTest extends TestCase
{
    private string $folder;

    protected function setUp(): void
    {
        parent::setUp();

        $this->folder = sys_get_temp_dir().'/path-confinement-'.bin2hex(random_bytes(6));
        mkdir("{$this->folder}/project/storage/app/public", 0o700, true);
        mkdir("{$this->folder}/project/storage/app/private/accounts/a", 0o700, true);
        mkdir("{$this->folder}/project/.git", 0o700, true);
        mkdir("{$this->folder}/outside", 0o700, true);
        file_put_contents("{$this->folder}/outside/secret.txt", 'secret');
        file_put_contents("{$this->folder}/project/notes.md", 'notes');
        file_put_contents("{$this->folder}/project/.git/config", '[core]');
        file_put_contents("{$this->folder}/project/storage/app/public/a.txt", 'public');

        config([
            'files.places.project' => "{$this->folder}/project",
            'files.places.temporary' => "{$this->folder}/project/storage",
            'accounts.root' => "{$this->folder}/project/storage/app/private/accounts",
        ]);
    }

    protected function tearDown(): void
    {
        new Filesystem()->deleteDirectory($this->folder);

        parent::tearDown();
    }

    public function test_a_file_linking_out_of_its_place_is_refused_without_naming_the_target(): void
    {
        symlink("{$this->folder}/outside/secret.txt", "{$this->folder}/project/evil.md");

        try {
            $this->confinement()->resolved(FilePath::in(Place::Project, 'evil.md'));
            $this->fail('A link out of the place was followed.');
        } catch (LinkLeavesPlace $refusal) {
            $this->assertStringContainsString(
                FilePath::in(Place::Project, 'evil.md')->label(),
                $refusal->getMessage(),
            );
            $this->assertStringNotContainsString($this->folder, $refusal->getMessage());
        }
    }

    public function test_a_link_inside_its_place_is_followed_to_the_real_path(): void
    {
        mkdir("{$this->folder}/project/public");
        symlink("{$this->folder}/project/storage/app/public", "{$this->folder}/project/public/storage");

        $this->assertSame(
            realpath("{$this->folder}/project/storage/app/public/a.txt"),
            $this->confinement()->resolved(FilePath::in(Place::Project, 'public/storage/a.txt')),
        );
    }

    public function test_links_leading_round_in_a_loop_are_refused(): void
    {
        symlink("{$this->folder}/project/b", "{$this->folder}/project/a");
        symlink('a', "{$this->folder}/project/b");

        $this->expectExceptionObject(LinkLoop::at(FilePath::in(Place::Project, 'a/x')->label()));

        $this->confinement()->resolved(FilePath::in(Place::Project, 'a/x'));
    }

    public function test_a_missing_file_is_named_missing(): void
    {
        $this->expectExceptionObject(FileMissing::at(FilePath::in(Place::Project, 'none.md')->label()));

        $this->confinement()->resolved(FilePath::in(Place::Project, 'none.md'));
    }

    public function test_the_git_folder_is_closed(): void
    {
        $this->expectExceptionObject(FolderClosed::at('.git'));

        $this->confinement()->resolved(FilePath::in(Place::Project, '.git/config'));
    }

    public function test_an_account_file_is_closed_from_the_project(): void
    {
        $this->expectExceptionObject(FolderClosed::at('storage/app/private'));

        $this->confinement()->resolved(FilePath::in(Place::Project, 'storage/app/private/accounts/a/settings.json'));
    }

    public function test_a_private_root_is_closed_from_every_other_place_wherever_it_lies(): void
    {
        mkdir("{$this->folder}/project/storage/accounts");
        config(['accounts.root' => "{$this->folder}/project/storage/accounts"]);

        $this->expectExceptionObject(FolderClosed::at('accounts'));

        $this->confinement()->resolved(FilePath::in(Place::Temporary, 'accounts/a/settings.json'));
    }

    public function test_a_link_into_a_closed_folder_is_refused_once_followed(): void
    {
        symlink("{$this->folder}/project/.git", "{$this->folder}/project/sneaky");

        $this->expectExceptionObject(FolderClosed::at('.git'));

        $this->confinement()->resolved(FilePath::in(Place::Project, 'sneaky/config'));
    }

    public function test_a_file_swapped_for_a_link_between_check_and_open_is_refused(): void
    {
        $file = FilePath::in(Place::Project, 'notes.md');
        $real = $this->confinement()->resolved($file);
        unlink($real);
        symlink("{$this->folder}/outside/secret.txt", $real);

        $this->expectExceptionObject(LinkLeavesPlace::from($file->label()));

        $this->confinement()->opened($file, $real, 'rb');
    }

    public function test_a_checked_file_opens(): void
    {
        $file = FilePath::in(Place::Project, 'notes.md');
        $handle = $this->confinement()->opened($file, $this->confinement()->resolved($file), 'rb');

        $this->assertSame('notes', stream_get_contents($handle));
    }

    public function test_a_file_not_written_yet_resolves_below_its_nearest_existing_folder(): void
    {
        $this->assertSame(
            realpath("{$this->folder}/project").'/new/deep/file.txt',
            $this->confinement()->resolvedForWrite(FilePath::in(Place::Project, 'new/deep/file.txt')),
        );
    }

    public function test_a_write_through_a_folder_linking_out_of_its_place_is_refused(): void
    {
        symlink("{$this->folder}/outside", "{$this->folder}/project/out");

        $this->expectExceptionObject(LinkLeavesPlace::from(FilePath::in(Place::Project, 'out/new.txt')->label()));

        $this->confinement()->resolvedForWrite(FilePath::in(Place::Project, 'out/new.txt'));
    }

    private function confinement(): PathConfinement
    {
        return $this->app->make(PathConfinement::class);
    }
}
