<?php

declare(strict_types=1);

namespace Tests\Unit\Files;

use App\Files\Enums\Place;
use App\Files\Exceptions\FileOutsidePlaces;
use App\Files\Exceptions\FolderClosed;
use App\Files\Exceptions\PlaceUnavailable;
use App\Files\Support\PlaceRoots;
use App\Files\Values\FilePath;
use Tests\TestCase;

/**
 * Each place resolves to one real folder when it is used, and an absolute path is placed in the open place holding
 * it, never in a private one.
 */
final class PlaceRootsTest extends TestCase
{
    private string $folder;

    protected function setUp(): void
    {
        parent::setUp();

        $this->folder = sys_get_temp_dir().'/place-roots-'.bin2hex(random_bytes(6));

        foreach (Place::cases() as $place) {
            mkdir("{$this->folder}/{$place->value}", 0o700, true);
        }
    }

    protected function tearDown(): void
    {
        foreach (Place::cases() as $place) {
            rmdir("{$this->folder}/{$place->value}");
        }

        rmdir($this->folder);

        parent::tearDown();
    }

    public function test_each_configured_place_resolves_to_its_real_folder(): void
    {
        foreach (Place::cases() as $place) {
            config([$place->rootSetting() => "{$this->folder}/{$place->value}"]);
        }

        foreach (Place::cases() as $place) {
            $this->assertSame(realpath("{$this->folder}/{$place->value}"), $this->roots()->root($place));
        }
    }

    public function test_a_place_with_a_missing_root_fails_only_when_it_is_used(): void
    {
        config(['accounts.root' => "{$this->folder}/missing", 'files.places.host-skills' => null]);

        $roots = $this->roots();

        $this->assertSame(realpath(base_path()), $roots->root(Place::Project));
        $this->assertSame(Place::Project, $roots->filePathOf(base_path('composer.json'))->place);
        $this->expectExceptionObject(PlaceUnavailable::for(Place::Accounts));

        $roots->root(Place::Accounts);
    }

    public function test_a_place_with_no_root_configured_is_unavailable(): void
    {
        config(['files.places.host-skills' => null]);

        $this->expectExceptionObject(PlaceUnavailable::for(Place::HostSkills));

        $this->roots()->root(Place::HostSkills);
    }

    public function test_an_absolute_project_path_is_placed_in_the_project(): void
    {
        $this->assertEquals(
            FilePath::in(Place::Project, 'app/Files/Values/FilePath.php'),
            $this->roots()->filePathOf(base_path('app/Files/../Files/Values/FilePath.php')),
        );
        $this->assertEquals(
            FilePath::in(Place::Project, 'notes-not-written-yet.md'),
            $this->roots()->filePathOf(base_path('notes-not-written-yet.md')),
        );
    }

    public function test_an_absolute_path_outside_every_place_is_refused_naming_the_open_places(): void
    {
        $this->expectExceptionObject(FileOutsidePlaces::given());

        $this->roots()->filePathOf('/etc/hosts');
    }

    public function test_an_absolute_path_inside_a_private_place_is_refused_as_closed(): void
    {
        config(['accounts.root' => "{$this->folder}/accounts"]);

        $this->expectExceptionObject(FolderClosed::privatePlace(Place::Accounts));

        $this->roots()->filePathOf("{$this->folder}/accounts/settings.json");
    }

    private function roots(): PlaceRoots
    {
        return $this->app->make(PlaceRoots::class);
    }
}
