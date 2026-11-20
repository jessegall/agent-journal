<?php

declare(strict_types=1);

namespace Tests\Unit\Files;

use App\CoreApi;
use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use App\Files\Exceptions\PlaceUnavailable;
use App\Files\Support\CodeFiles;
use App\Files\Support\LocalFiles;
use App\Files\Values\Depth;
use App\Files\Values\FilePath;
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
        $files = $this->app->make(Files::class);

        $this->assertInstanceOf(LocalFiles::class, $files);
        $this->assertSame($files, $this->app->make(Files::class));
    }

    public function test_code_reads_through_files_are_the_process_code_reads(): void
    {
        $pattern = FilePath::in(Place::Project, 'app/Files/Contracts/*.php');

        $this->assertSame(CodeFiles::ofProcess()->folder($pattern), $this->app->make(Files::class)->codeFolder($pattern));
    }

    public function test_core_exports_the_funnel_to_the_domains(): void
    {
        foreach ([Files::class, FilePath::class, Place::class, Depth::class, PlaceUnavailable::class] as $type) {
            $this->assertTrue(CoreApi::exports()->has($type), "{$type} is not exported");
        }
    }

    public function test_a_test_points_a_place_at_its_own_folder_and_reads_there(): void
    {
        $folder = $this->placeInTemporaryFolder(Place::SharingSecrets);
        file_put_contents("{$folder}/gateway-token", 'secret');
        $file = FilePath::in(Place::SharingSecrets, 'gateway-token');

        foreach (range(1, 3) as $read) {
            $this->assertSame('secret', $this->app->make(Files::class)->read($file));
        }

        $this->assertSame(3, $this->app->make(Files::class)->readCount($file));
        $this->assertSame((string) realpath(config('sharing.secrets_dir')), $folder);
    }

    public function test_a_place_without_a_root_fails_only_when_used_while_others_work(): void
    {
        $folder = $this->placeInTemporaryFolder(Place::Temporary);
        file_put_contents("{$folder}/a.txt", 'a');
        config(['files.places.host-skills' => "{$folder}/missing"]);
        $files = $this->app->make(Files::class);

        $this->assertSame('a', $files->read(FilePath::in(Place::Temporary, 'a.txt')));
        $this->expectExceptionObject(PlaceUnavailable::for(Place::HostSkills));

        $files->read(FilePath::in(Place::HostSkills, 'skill.md'));
    }
}
