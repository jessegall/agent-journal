<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Sessions\CleanupStep;

/**
 * What a host reports of one cleanup pass: the resources it removed or found already gone, the dirty workspace it
 * kept for recovery, and why a deletion failed.
 */
final readonly class CleanupReport
{
    /**
     * @param  list<CleanupStep>  $removedSteps
     */
    public function __construct(
        public array $removedSteps,
        public string|null $keptWorkspace,
        public string|null $failure,
    ) {}

    public function hasFailed(): bool
    {
        return $this->failure !== null;
    }
}
