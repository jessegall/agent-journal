<?php

declare(strict_types=1);

namespace App\Hosts\Values;

/**
 * One driver a run_fenced order runs: its absolute argv, run without a shell in a clean environment, in its folder,
 * within its deadline and output limit.
 */
final readonly class FencedRun
{
    /**
     * @param  list<string>  $argv
     */
    public function __construct(
        public array $argv,
        public string $folder,
        public int $deadlineMs,
        public int $outputLimit,
    ) {}

    /**
     * @return array{argv: list<string>, folder: string, deadline_ms: int, output_limit: int}
     */
    public function payload(): array
    {
        return [
            'argv' => $this->argv,
            'folder' => $this->folder,
            'deadline_ms' => $this->deadlineMs,
            'output_limit' => $this->outputLimit,
        ];
    }
}
