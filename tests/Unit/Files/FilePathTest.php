<?php

declare(strict_types=1);

namespace Tests\Unit\Files;

use App\Files\Enums\Place;
use App\Files\Exceptions\FilePathInvalid;
use App\Files\Values\FilePath;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

/**
 * A file path stays inside its place: it refuses a climb, a root path and a NUL byte, and equal paths are equal.
 */
final class FilePathTest extends TestCase
{
    /**
     * @return iterable<string, array{string}>
     */
    public static function climbingPaths(): iterable
    {
        yield 'a parent folder' => ['../x'];

        yield 'a parent folder that lands back inside' => ['app/../app/x'];

        yield 'the root' => ['/x'];
    }

    #[DataProvider('climbingPaths')]
    public function test_a_path_that_climbs_out_of_its_place_is_refused_by_name(string $relative): void
    {
        $this->expectExceptionObject(FilePathInvalid::climbs($relative));

        FilePath::in(Place::Project, $relative);
    }

    public function test_a_path_with_a_nul_byte_is_refused_by_name(): void
    {
        $this->expectExceptionObject(FilePathInvalid::nulByte());

        FilePath::in(Place::Project, "notes.md\0.php");
    }

    public function test_paths_naming_the_same_file_are_equal_and_a_child_lies_below_its_folder(): void
    {
        $this->assertEquals(FilePath::in(Place::Project, 'app/Files'), FilePath::in(Place::Project, './app//Files/'));
        $this->assertNotEquals(FilePath::in(Place::Project, 'app'), FilePath::in(Place::Temporary, 'app'));
        $this->assertEquals(FilePath::in(Place::Project, 'app/Files'), FilePath::in(Place::Project, 'app')->child('Files'));
        $this->assertSame('app', FilePath::in(Place::Project, '')->child('app')->relative);
    }

    public function test_a_child_name_that_climbs_is_refused(): void
    {
        $this->expectException(FilePathInvalid::class);

        FilePath::in(Place::Project, 'app')->child('..');
    }

    public function test_a_child_name_from_the_root_is_refused(): void
    {
        $this->expectExceptionObject(FilePathInvalid::climbs('/etc/passwd'));

        FilePath::in(Place::Project, 'app')->child('/etc/passwd');
    }

    public function test_a_place_holding_secrets_says_it_is_private(): void
    {
        $this->assertTrue(Place::Accounts->isPrivate());
        $this->assertFalse(Place::Project->isPrivate());
        $this->assertSame(0o700, Place::SharingSecrets->folderMode());
        $this->assertSame(0o755, Place::Temporary->folderMode());
        $this->assertSame(
            [Place::Project, Place::HostSkills, Place::Temporary, Place::ProcessOutput],
            Place::notPrivate(),
        );
    }
}
