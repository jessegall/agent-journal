<?php

declare(strict_types=1);

namespace App\Sessions;

use App\Profiles\StartProfileKey;

/**
 * Which of an owner's helpers may take a new start: the profile key it must pin, the chosen driver and exact model,
 * the opaque purpose its conversations are kept under, and the owner's facts about each helper.
 */
final readonly class StartCandidateQuery
{
    /**
     * @param  list<StartCandidateFacts>  $helpers
     */
    public function __construct(
        public StartProfileKey $profile,
        public string $driver,
        public string $model,
        public string $purposeReference,
        public array $helpers,
    ) {}
}
