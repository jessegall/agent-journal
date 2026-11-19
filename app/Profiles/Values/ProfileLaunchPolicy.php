<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Agents\Enums\ExecutionModeType;
use App\Agents\Support\ExecutionBudgets;
use App\Agents\Support\ExecutionPolicy;
use App\Agents\Values\AccessPolicy;
use App\Agents\Values\StopConditions;
use App\Profiles\Enums\PolicyOriginType;
use App\Profiles\Enums\ProfileType;
use App\Programs\Enums\HookProgram;

/**
 * How a profile's agent is launched: its program and whether a launch may choose another, the models it allows (none
 * listed allows any), what it may do, the conditions it must pass before it stops, where it runs, and where each of
 * those came from. The worktree of its execution policy is the role's placeholder, which the host resolves per launch.
 */
final readonly class ProfileLaunchPolicy
{
    public const string WORKSPACE = 'workspace';

    public const string HELPER_IMAGE = 'journal-helper';

    public const array FIELDS = ['program', 'allowedModels', 'access', 'stopConditions', 'execution'];

    /**
     * @param  list<string>  $allowedModels
     */
    public function __construct(
        public HookProgram|null $program,
        public bool $programPinned,
        public array $allowedModels,
        public AccessPolicy $access,
        public StopConditions $stopConditions,
        public ExecutionPolicy $execution,
        public ProfileProvenance $provenance,
    ) {}

    /**
     * The global defaults of the type for a program, pinned or open: every policy field from the defaults.
     *
     * @param  list<string>  $allowedModels
     */
    public static function defaultsFor(
        ProfileType $type,
        HookProgram|null $program,
        bool $programPinned,
        array $allowedModels,
        string $configurationHash,
    ): self {
        $role = $type->agentRole();

        return new self(
            $program,
            $programPinned,
            $allowedModels,
            AccessPolicy::defaultsFor($role),
            StopConditions::make($role, $type->defaultStopConditions()),
            self::defaultExecution($type),
            new ProfileProvenance(
                $configurationHash,
                array_map(fn (string $field) => new FieldOrigin($field, PolicyOriginType::GlobalDefault), self::FIELDS),
            ),
        );
    }

    /**
     * Where a type runs by default: on the protected host, or in a required container of the journal's helper image,
     * which the host resolves to its verified digest.
     */
    private static function defaultExecution(ProfileType $type): ExecutionPolicy
    {
        $mode = $type->defaultExecutionMode();
        $image = $mode === ExecutionModeType::RequiredContainer ? self::HELPER_IMAGE : null;

        return ExecutionPolicy::make($mode, $image, self::WORKSPACE, ExecutionBudgets::defaults(), []);
    }
}
