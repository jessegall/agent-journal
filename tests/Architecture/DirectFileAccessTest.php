<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\DirectFileAccess;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Only the Files area touches the disk: every other direct file function, directory iterator, Finder or Filesystem in
 * app/ and the domains is either on the waiting list of sites still to move, or the test fails. A listed site the code
 * no longer has fails it too, so the list stays true and only shrinks.
 */
#[TimeLimit(seconds: 15, reason: 'It parses every PHP file of app/ and the domains.')]
final class DirectFileAccessTest extends TestCase
{
    private const string HOW_TO_FIX = "Read, list, stat and write files through App\\Contracts\\Files:\n";

    private const array FILES_PRIMITIVES = [
        'app/Support/CodeFiles.php',
        'app/Support/FileWriter.php',
        'app/Support/FolderWalker.php',
        'app/Support/LocalFiles.php',
        'app/Support/PathConfinement.php',
        'app/Support/PlaceRoots.php',
    ];

    public function test_only_the_files_area_touches_the_disk(): void
    {
        $found = DirectFileAccess::across(base_path())->outside('app/Files');

        // The Files primitives that already sit in app/Support by role touch the disk as app/Files does.
        foreach (self::FILES_PRIMITIVES as $primitive) {
            $found = $found->outside($primitive);
        }

        $this->assertSame(
            $found->listedSites(),
            $found->sites(),
            self::HOW_TO_FIX.$found->report(),
        );
    }
}
