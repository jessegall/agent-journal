<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Agents\Enums\ExecutionModeType;
use App\Agents\Values\StopCondition;
use App\Profiles\Values\ProfileBase;
use App\Profiles\Values\ProfileKey;
use App\Programs\Enums\HookProgram;

/**
 * One profile as a proposal describes it, before its policy is resolved: its key, label, type, instructions, model
 * rules, skill lists, where it asks to run, its override of the inherited policy and its own stop conditions.
 */
final readonly class ProposedProfile
{
    /**
     * @param  list<string>  $allowedModels
     * @param  list<string>|null  $skillAllowlist
     * @param  list<string>  $requiredSkills
     * @param  list<StopCondition>  $stopConditions
     */
    public function __construct(
        public ProfileKey $key,
        public string $label,
        public ProfileBase $base,
        public string $instructions,
        public string $model,
        public HookProgram|null $program,
        public bool $programPinned,
        public array $allowedModels,
        public array|null $skillAllowlist,
        public array $requiredSkills,
        public ExecutionModeType|null $container,
        public PolicyOverride $override,
        public array $stopConditions,
    ) {}
}
