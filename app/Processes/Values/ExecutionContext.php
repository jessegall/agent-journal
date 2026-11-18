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
     * The key that scopes a project's saved aliases: a digest of its root folder.
     */
    public function projectKey(): string
    {
        return hash('sha256', realpath($this->projectRoot) ?: $this->projectRoot);
    }

    public function withWorkingFolder(string $workingFolder): self
    {
        return new self($this->dialect, $workingFolder, $this->projectRoot, $this->environment, $this->programs, $this->positional, $this->aliases, $this->pipefail, $this->lastStatus);
    }

    /**
     * @param  array<string, string>  $environment
     */
    public function withEnvironment(array $environment): self
    {
        return new self($this->dialect, $this->workingFolder, $this->projectRoot, $environment, $this->programs, $this->positional, $this->aliases, $this->pipefail, $this->lastStatus);
    }

    /**
     * @param  array<string, string>  $programs
     */
    public function withPrograms(array $programs): self
    {
        return new self($this->dialect, $this->workingFolder, $this->projectRoot, $this->environment, $programs, $this->positional, $this->aliases, $this->pipefail, $this->lastStatus);
    }

    /**
     * @param  list<string>  $positional
     */
    public function withPositional(array $positional): self
    {
        return new self($this->dialect, $this->workingFolder, $this->projectRoot, $this->environment, $this->programs, $positional, $this->aliases, $this->pipefail, $this->lastStatus);
    }

    /**
     * The context inside a saved alias's body: its arguments become $1, $2 ... and its id joins the chain.
     *
     * @param  list<string>  $arguments
     */
    public function insideAlias(string $aliasId, array $arguments): self
    {
        return new self($this->dialect, $this->workingFolder, $this->projectRoot, $this->environment, $this->programs, $arguments, [...$this->aliases, $aliasId], $this->pipefail, $this->lastStatus);
    }

    public function withPipefail(bool $pipefail): self
    {
        return new self($this->dialect, $this->workingFolder, $this->projectRoot, $this->environment, $this->programs, $this->positional, $this->aliases, $pipefail, $this->lastStatus);
    }

    public function withLastStatus(int $status): self
    {
        return new self($this->dialect, $this->workingFolder, $this->projectRoot, $this->environment, $this->programs, $this->positional, $this->aliases, $this->pipefail, $status);
    }
}
