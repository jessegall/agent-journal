<?php

declare(strict_types=1);

namespace App\Values;

use App\Agents\Values\PlanFile;
use App\Agents\Values\RestartFile;
use App\Exceptions\PlanAdditionClash;

/**
 * What start plan parts add to a start: files, side sockets, at most one Seatbelt profile and at most one restart file.
 */
final readonly class PlanAddition
{
    /**
     * @param  list<PlanFile>  $files
     * @param  list<string>  $sideSockets
     */
    public function __construct(
        public array $files = [],
        public array $sideSockets = [],
        public string|null $seatbelt = null,
        public RestartFile|null $restartWhenFile = null,
    ) {}

    /**
     * This addition followed by the other.
     *
     * @throws PlanAdditionClash
     */
    public function with(self $other): self
    {
        if ($this->seatbelt !== null && $other->seatbelt !== null) {
            throw PlanAdditionClash::of('seatbelt');
        }

        if ($this->restartWhenFile !== null && $other->restartWhenFile !== null) {
            throw PlanAdditionClash::of('restart file');
        }

        return new self(
            [...$this->files, ...$other->files],
            [...$this->sideSockets, ...$other->sideSockets],
            $this->seatbelt ?? $other->seatbelt,
            $this->restartWhenFile ?? $other->restartWhenFile,
        );
    }
}
