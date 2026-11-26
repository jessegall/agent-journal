<?php

declare(strict_types=1);

namespace App\Values;

use App\Agents\Values\PlanFile;
use App\Agents\Values\RestartFile;
use App\Exceptions\PlanAdditionClash;

/**
 * What start plan parts add to a start: files, side sockets and at most one restart file.
 */
final readonly class PlanAddition
{
    /**
     * @param  list<PlanFile>  $files
     * @param  list<string>  $sideSockets
     * @param  list<string>  $keptFiles  files a device keeps for its binding between two sessions, such as a sign-in
     */
    public function __construct(
        public array $files = [],
        public array $sideSockets = [],
        public RestartFile|null $restartWhenFile = null,
        public array $keptFiles = [],
    ) {}

    /**
     * This addition followed by the other.
     *
     * @throws PlanAdditionClash
     */
    public function with(self $other): self
    {
        if ($this->restartWhenFile !== null && $other->restartWhenFile !== null) {
            throw PlanAdditionClash::of('restart file');
        }

        return new self(
            [...$this->files, ...$other->files],
            [...$this->sideSockets, ...$other->sideSockets],
            $this->restartWhenFile ?? $other->restartWhenFile,
            [...$this->keptFiles, ...$other->keptFiles],
        );
    }
}
