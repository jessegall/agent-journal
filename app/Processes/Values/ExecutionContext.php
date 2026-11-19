<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Enums\ShellDialect;

/**
 * Where a command would run, as far as classification may trust it: the dialect, the working folder, the trusted
 * environment and project root, how program names resolve to executables, and the positional parameters an alias
 * body receives. It never changes; each with-method returns a new context.
 */
final readonly class ExecutionContext
{
    /**
     * @param  array<string, string>  $environment  the trusted environment variables
     * @param  array<string, string>  $programs  program name => resolved executable path
     * @param  list<string>  $positional  $1, $2 ... in order
     * @param  list<string>  $aliases  the ids of the saved aliases whose bodies this command runs inside, outermost first
     * @param  bool  $pipefail  whether a pipeline fails when any member fails, not only the last
     * @param  int  $lastStatus  the status $? reads
     */
    public function __construct(
        public ShellDialect $dialect,
        public string $workingFolder,
        public string $projectRoot,
        public array $environment = [],
        public array $programs = [],
        public array $positional = [],
        public array $aliases = [],
        public bool $pipefail = false,
        public int $lastStatus = 0,
    ) {}

    /**
     * A bash context in a folder that is also its project root, as an admitted command or a request is scoped.
     */
    public static function inFolder(string $folder): self
    {
        return new self(ShellDialect::Bash, $folder, $folder);
    }

    /**
     * The key that scopes a project's saved aliases: a digest of its root folder.
     */
    public function projectKey(): string
    {
        return hash('sha256', realpath($this->projectRoot) ?: $this->projectRoot);
    }

    public function withWorkingFolder(string $workingFolder): self
    {
        return clone ($this, ['workingFolder' => $workingFolder]);
    }

    /**
     * @param  array<string, string>  $environment
     */
    public function withEnvironment(array $environment): self
    {
        return clone ($this, ['environment' => $environment]);
    }

    /**
     * @param  array<string, string>  $programs
     */
    public function withPrograms(array $programs): self
    {
        return clone ($this, ['programs' => $programs]);
    }

    /**
     * @param  list<string>  $positional
     */
    public function withPositional(array $positional): self
    {
        return clone ($this, ['positional' => $positional]);
    }

    /**
     * The context inside a saved alias's body: its arguments become $1, $2 ... and its id joins the chain.
     *
     * @param  list<string>  $arguments
     */
    public function insideAlias(string $aliasId, array $arguments): self
    {
        return clone ($this, ['positional' => $arguments, 'aliases' => [...$this->aliases, $aliasId]]);
    }

    public function withPipefail(bool $pipefail): self
    {
        return clone ($this, ['pipefail' => $pipefail]);
    }

    public function withLastStatus(int $status): self
    {
        return clone ($this, ['lastStatus' => $status]);
    }
}
