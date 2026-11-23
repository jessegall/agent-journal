<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\ExecutionModeType;
use App\Enums\InstancePolicy;
use App\Values\ProfileBase;
use App\Values\ProfileKey;
use App\Values\StopCondition;
use App\Values\SupervisorRoutes;
use App\Values\WithheldGrant;

/**
 * One profile as a proposal describes it, before its policy is resolved: its key, label, type, instructions, model
 * rules, skill lists, where it asks to run, its override of the inherited policy, its own stop conditions and the
 * abilities of its base it withholds.
 */
final readonly class ProposedProfile
{
    /**
     * @param  list<string>  $allowedModels
     * @param  list<string>|null  $skillAllowlist
     * @param  list<string>  $requiredSkills
     * @param  list<StopCondition>  $stopConditions
     * @param  list<WithheldGrant>  $withheldGrants
     * @param  list<string>  $deniedCommands  application command classes the profile refuses outright
     */
    public function __construct(
        public ProfileKey $key,
        public string $label,
        public ProfileBase $base,
        public string $instructions,
        public string $model,
        public string|null $driver,
        public bool $driverPinned,
        public array $allowedModels,
        public array|null $skillAllowlist,
        public array $requiredSkills,
        public ExecutionModeType|null $container,
        public PolicyOverride $override,
        public array $stopConditions,
        public array $withheldGrants = [],
        public array $deniedCommands = [],
        public SupervisorRoutes $supervisor = new SupervisorRoutes(),
        public InstancePolicy $instances = InstancePolicy::Reusable,
        public string $description = '',
    ) {}
}
