<?php

declare(strict_types=1);

namespace Tests\Unit\Files;

use App\Contracts\Files\Files as FilesContract;
use App\Enums\Files\Place;
use App\Exceptions\PlaceUnavailable;
use App\Support\CodeFiles;
use App\Support\Files;
use App\Values\FilePath;
use Tests\Support\Files\UsesTemporaryPlaces;
use Tests\TestCase;

/**
 * The application holds one Files, shared by every class that asks for it; a test points a place at
 * a folder of its own, and a place without a root fails only when it is used.
 */
final class FilesServiceTest extends TestCase
{
    use UsesTemporaryPlaces;

    public function test_the_application_holds_one_files_for_every_class_that_asks(): void
    {
        $files = $this->app->make(FilesContract::class);

        $this->assertInstanceOf(Files::class, $files);
        $this->assertSame($files, $this->app->make(FilesContract::class));
    }

    public function test_code_reads_through_files_are_the_process_code_reads(): void
    {
        $pattern = FilePath::in(Place::Project, 'app/Contracts/*.php');

        $this->assertSame(CodeFiles::ofProcess()->folder($pattern), $this->app->make(FilesContract::class)->codeFolder($pattern));
    }

    public function test_a_test_points_a_place_at_its_own_folder_and_reads_there(): void
    {
        $folder = $this->placeInTemporaryFolder(Place::SharingSecrets);
        file_put_contents("{$folder}/gateway-token", 'secret');
        $file = FilePath::in(Place::SharingSecrets, 'gateway-token');

        foreach (range(1, 3) as $read) {
            $this->assertSame('secret', $this->app->make(FilesContract::class)->read($file));
        }

        $this->assertSame(3, $this->app->make(FilesContract::class)->readCount($file));
        $this->assertSame((string) realpath(config('sharing.secrets_dir')), $folder);
    }

    public function test_a_place_without_a_root_fails_only_when_used_while_others_work(): void
    {
        $folder = $this->placeInTemporaryFolder(Place::Temporary);
        file_put_contents("{$folder}/a.txt", 'a');
        file_put_contents("{$folder}/blocker", '');
        config(['files.places.host-skills' => "{$folder}/blocker/skills"]);
        $files = $this->app->make(FilesContract::class);

        $this->assertSame('a', $files->read(FilePath::in(Place::Temporary, 'a.txt')));
        $this->expectExceptionObject(PlaceUnavailable::for(Place::HostSkills));

        $files->read(FilePath::in(Place::HostSkills, 'skill.md'));
    }
}
