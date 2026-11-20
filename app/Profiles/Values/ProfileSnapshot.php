<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Agents\Values\Operation;
use App\Processes\Values\ProcessGrants;
use BackedEnum;
use Spatie\LaravelData\Data;

/**
 * One immutable revision of a profile as a start reads it: its type, instructions, default model, skill lists and
 * start policy. A null skill allowlist means every applicable skill; an empty one means none.
 */
final class ProfileSnapshot extends Data
{
    /**
     * @param  list<string>|null  $skillAllowlist
     * @param  list<string>  $requiredSkills
     */
    public function __construct(
        public readonly ProfileKey $key,
        public readonly int $revision,
        public readonly ProfileBase $base,
        public readonly string $instructions,
        public readonly string $model,
        public readonly array|null $skillAllowlist,
        public readonly array $requiredSkills,
        public readonly ProfileStartPolicy $start,
        public readonly ProfileAuthorization $authorization,
        public readonly SupervisorRoutes $supervisor = new SupervisorRoutes(),
    ) {}

    /**
     * What this revision lets a start run, from its access declaration.
     */
    public function processGrants(): ProcessGrants
    {
        return $this->start->access->processes;
    }

    public function allowsOperation(Operation $operation): bool
    {
        return $this->start->access->decide($operation)->allowed;
    }

    public function grants(string $policy, BackedEnum $ability): bool
    {
        return $this->authorization->grants($policy, $ability);
    }
}
