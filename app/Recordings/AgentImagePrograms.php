<?php

declare(strict_types=1);

namespace App\Recordings;

use App\Recordings\Exceptions\AgentImageProgramsUnreadable;
use Illuminate\Container\Attributes\Singleton;
use Illuminate\Process\Factory as ProcessFactory;

/**
 * The digest of what the agent image runs besides the drivers, as scripts/agent-image-programs.sh reads it from the
 * image's Dockerfile and the Go programs it builds: a recording made before it changed is stale.
 */
#[Singleton]
final class AgentImagePrograms
{
    public const string SCRIPT = 'scripts/agent-image-programs.sh';

    /**
     * The hash this process read: the image's programs do not change while it runs, so the script runs once.
     */
    private string|null $hash = null;

    public function __construct(private readonly ProcessFactory $processes) {}

    /**
     * @throws AgentImageProgramsUnreadable
     */
    public function hash(): string
    {
        if ($this->hash !== null) {
            return $this->hash;
        }

        $run = $this->processes->newPendingProcess()->path(base_path())->run(['sh', self::SCRIPT]);

        if (! $run->successful()) {
            throw AgentImageProgramsUnreadable::because($run->errorOutput());
        }

        return $this->hash = trim($run->output());
    }
}
