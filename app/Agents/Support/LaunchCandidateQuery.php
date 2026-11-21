<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Drivers\Enums\HookDriver;

/**
 * Which of an owner's helpers may take a new launch: the profile key it must pin, the chosen program and exact model,
 * the opaque purpose its conversations are kept under, and the owner's facts about each helper.
 */
final readonly class LaunchCandidateQuery
{
    /**
     * @param  list<LaunchCandidateFacts>  $helpers
     */
    public function __construct(
        public LaunchProfileKey $profile,
        public HookDriver $driver,
        public string $model,
        public string $purposeReference,
        public array $helpers,
    ) {}
}
