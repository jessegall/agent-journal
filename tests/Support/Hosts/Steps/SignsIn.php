<?php

declare(strict_types=1);

namespace Tests\Support\Hosts\Steps;

use Tests\Support\Hosts\Steps\Contracts\HostStep;
use Tests\Support\Hosts\TestHost;
use Tests\Support\Seeding\TestJournal;

/**
 * The test host's sign-in runner ends its pass, which must end well.
 */
final readonly class SignsIn implements HostStep
{
    public function __invoke(TestJournal $journal): void
    {
        $journal->testHost(fn (TestHost $host) => $host->waitForSignIns());
    }
}
