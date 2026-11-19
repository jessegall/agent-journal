<?php

declare(strict_types=1);

namespace Tests\Support;

/**
 * Installs the journal's desks before each test, as the host does when the journal starts.
 */
trait InstallsDesks
{
    use RunsDeskInstall;

    protected function setUpInstallsDesks(): void
    {
        $this->installDesks();
    }
}
