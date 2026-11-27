<?php

declare(strict_types=1);

namespace Tests\Support\Hosts\Steps;

use Tests\Support\Hosts\Steps\Contracts\HostStep;
use Tests\Support\Hosts\TestHost;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner completes the device sign-in the test host's Codex shows in the browser.
 */
final readonly class CompletesBrowserSignIn implements HostStep
{
    public function __invoke(TestJournal $journal): void
    {
        $journal->testHost(fn (TestHost $host) => $host->completeBrowserSignIn());
    }
}
