<?php

declare(strict_types=1);

namespace Tests\Support\Files;

use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use Illuminate\Support\Facades\File;

/**
 * Points a place of the file funnel at a temporary folder of this test's own, under the system's temporary folder
 * with the ParaTest worker's token, and gives the test a fresh Files reading there; the folders are removed after
 * the test.
 */
trait UsesTemporaryPlaces
{
    /**
     * @var list<string>
     */
    private array $temporaryPlaceFolders = [];

    /**
     * Makes the place's temporary folder and points the place at it; the real path of the folder is returned.
     */
    protected function placeInTemporaryFolder(Place $place): string
    {
        $token = getenv('TEST_TOKEN') ?: 'alone';
        $folder = sys_get_temp_dir()."/place-{$place->value}-{$token}-".bin2hex(random_bytes(6));
        File::makeDirectory($folder, $place->folderMode(), true);
        $real = (string) realpath($folder);
        $this->temporaryPlaceFolders[] = $real;
        config([$place->rootSetting() => $real]);
        $this->app->forgetInstance(Files::class);

        if ($place === Place::Project) {
            $this->keepDriverPins($real);
        }

        return $real;
    }

    /**
     * A project moved to a temporary folder is still this journal's, which pins each driver in its image folder's
     * VERSION file.
     */
    private function keepDriverPins(string $project): void
    {
        foreach (File::glob(base_path('.docker/drivers/*/VERSION')) as $pin) {
            $kept = $project.'/'.substr($pin, strlen(base_path()) + 1);
            File::ensureDirectoryExists(dirname($kept));
            File::copy($pin, $kept);
        }
    }

    protected function tearDownUsesTemporaryPlaces(): void
    {
        foreach ($this->temporaryPlaceFolders as $folder) {
            File::deleteDirectory($folder);
        }
    }
}
