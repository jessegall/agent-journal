<?php

declare(strict_types=1);

namespace Tests\Support;

use Illuminate\Support\Facades\File;

/**
 * Gives a test a folder of its own under the system's temporary folder, deleted when the test ends.
 */
trait UsesTemporaryFolder
{
    protected string $root;

    protected function makeTemporaryFolder(string $prefix): string
    {
        $folder = sys_get_temp_dir().'/'.$prefix.'-'.bin2hex(random_bytes(6));
        File::makeDirectory($folder, recursive: true);
        $this->root = (string) realpath($folder);

        return $this->root;
    }

    protected function tearDownUsesTemporaryFolder(): void
    {
        File::deleteDirectory($this->root);
    }
}
