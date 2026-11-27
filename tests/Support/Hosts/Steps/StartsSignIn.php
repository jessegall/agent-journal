<?php

declare(strict_types=1);

namespace Tests\Support\Hosts\Steps;

use Tests\Support\Hosts\Steps\Contracts\HostStep;
use Tests\Support\Hosts\TestHost;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner begins a sign-in of the driver, named for the test, and the test host's sign-in runner takes it.
 */
final readonly class StartsSignIn implements HostStep
{
    private function __construct(private string $driver, private string $name) {}

    public static function of(string $driver, string|null $name = null): self
    {
        return new self($driver, $name ?? $driver);
    }

    public function __invoke(TestJournal $journal): void
    {
        $journal->beginSignIn($this->name, $this->driver)->testHost(fn (TestHost $host) => $host->startSignIns());
    }
}
