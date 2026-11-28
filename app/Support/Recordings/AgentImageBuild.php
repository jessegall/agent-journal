<?php

declare(strict_types=1);

namespace App\Support\Recordings;

use App\Support\Recordings\Exceptions\AgentImageBuildUnreadable;
use Illuminate\Container\Attributes\Config;
use Illuminate\Container\Attributes\Singleton;
use Illuminate\Process\Factory as ProcessFactory;

/**
 * The digest of the agent image's Dockerfile and the tools it builds.
 */
#[Singleton]
final class AgentImageBuild
{
    /**
     * The hash this process read: the image's build does not change while it runs, so the script runs once.
     */
    private string|null $hash = null;

    public function __construct(
        private readonly ProcessFactory $processes,
        #[Config('journal.recordings.image_build_script')]
        private readonly string $script,
    ) {}

    /**
     * @throws AgentImageBuildUnreadable
     */
    public function hash(): string
    {
        if ($this->hash !== null) {
            return $this->hash;
        }

        $run = $this->processes->newPendingProcess()->path(base_path())->run(['sh', $this->script]);

        if (! $run->successful()) {
            throw AgentImageBuildUnreadable::because($this->script, $run->errorOutput());
        }

        return $this->hash = trim($run->output());
    }
}
