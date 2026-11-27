<?php

declare(strict_types=1);

namespace App\Recordings;

use App\Recordings\Exceptions\AgentImageProgramsUnreadable;
use Illuminate\Process\Factory as ProcessFactory;

/**
 * The digest of what the agent image runs besides the drivers, as scripts/agent-image-programs.sh reads it from the
 * image's Dockerfile and the Go programs it builds: a recording made before it changed is stale.
 */
final readonly class AgentImagePrograms
{
    public const string SCRIPT = 'scripts/agent-image-programs.sh';

    public function __construct(private ProcessFactory $processes) {}

    /**
     * @throws AgentImageProgramsUnreadable
     */
    public function hash(): string
    {
        $run = $this->processes->newPendingProcess()->path(base_path())->run(['sh', self::SCRIPT]);

        if (! $run->successful()) {
            throw AgentImageProgramsUnreadable::because($run->errorOutput());
        }

        return trim($run->output());
    }
}
