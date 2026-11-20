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
    public function test_only_the_files_area_touches_the_disk(): void
    {
        $found = DirectFileAccess::across(base_path())->outside('app/Files');

        $this->assertSame(
            $found->waitingSites(),
            $found->sites(),
            "Read, list, stat and write files through App\\Files\\Contracts\\Files:\n".$found->report(),
        );
    }
}
