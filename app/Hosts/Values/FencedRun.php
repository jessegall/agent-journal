<?php

declare(strict_types=1);

namespace App\Hosts\Values;

use App\Hosts\Protocol\Payloads\HostFencedRunPayload;

/**
 * One driver a run_fenced instruction runs: its absolute argv, run without a shell in a clean environment, in its folder,
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
     * The run as the run_fenced instruction carries it.
     */
    public function plan(): HostFencedRunPayload
    {
        return HostFencedRunPayload::from([
            'argv' => $this->argv,
            'folder' => $this->folder,
            'deadline_ms' => $this->deadlineMs,
            'output_limit' => $this->outputLimit,
        ]);
    }
}
