<?php

declare(strict_types=1);

namespace Tests\Support;

/**
 * Installs the journal's inboxes before each test, as the host does when the journal starts.
 */
trait InstallsInboxes
{
    use RunsInboxInstall;

    protected function setUpInstallsInboxes(): void
    {
        $this->installInboxes();
    }
}
