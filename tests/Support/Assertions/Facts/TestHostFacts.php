<?php

declare(strict_types=1);

namespace Tests\Support\Assertions\Facts;

use Tests\Support\Assertions\Contracts\Facts;
use Tests\Support\Hosts\TestHost;

/**
 * What the running test host's mocks saw: each line Codex heard, by its method, each start of Claude Code and Codex,
 * the keys each key recorder read and the containers its Docker mock started.
 */
final readonly class TestHostFacts implements Facts
{
    public function __construct(private TestHost $host) {}

    public function facts(): array
    {
        return [
            'heardByCodex' => fn () => $this->heardByCodex(),
            'claudeStarts' => fn () => $this->host->claudeStarts(),
            'codexStarts' => fn () => $this->host->codexStarts(),
            'keysRecorded' => fn () => $this->host->keysRecorded(),
            'containers' => fn () => $this->host->startedContainers(),
        ];
    }

    /**
     * @return array<string, list<array<string, mixed>>>
     */
    private function heardByCodex(): array
    {
        $heard = [];

        foreach ($this->host->heardByCodex() as $line) {
            $heard[(string) ($line['method'] ?? 'answer')][] = $line;
        }

        return $heard;
    }
}
