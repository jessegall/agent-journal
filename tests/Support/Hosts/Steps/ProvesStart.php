<?php

declare(strict_types=1);

namespace Tests\Support\Hosts\Steps;

use App\Hosts\Enums\HostProcessPurpose;
use Tests\Support\Agents\TestAgent;
use Tests\Support\Hosts\Steps\Contracts\HostStep;
use Tests\Support\Seeding\TestJournal;

/**
 * The journal proves the agent's start on the test host, and the test names the process the proven start opens.
 */
final readonly class ProvesStart implements HostStep
{
    private function __construct(private string $agent, private HostProcessPurpose $opens, private string $name) {}

    public static function of(string $agent, HostProcessPurpose $opens, string $name): self
    {
        return new self($agent, $opens, $name);
    }

    public function __invoke(TestJournal $journal): void
    {
        $journal->withAgent($this->agent, fn (TestAgent $agent) => $agent->proveStart($this->opens, $this->name));
    }
}
