<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Agents\Enums\ExecutionModeType;
use App\Agents\Values\AccessDecision;
use App\Agents\Values\AccessPolicy;
use App\Agents\Values\ExecutionBudgets;
use App\Agents\Values\ExecutionPolicy;
use App\Agents\Values\Operation;
use App\Agents\Values\StartPolicy;
use App\Agents\Values\StopConditions;
use App\Profiles\Enums\PolicyOriginType;

/**
 * How a profile's agent is started: its driver and whether a start may choose another, the models it allows (none
 * listed allows any), what it may do, the conditions it must pass before it stops, where it runs, and where each of
 * those came from. The worktree of its execution policy is the type's placeholder, which the host resolves per start.
 */
final readonly class ProfileStartPolicy
{
    public const string WORKSPACE = 'workspace';

    public const string HELPER_IMAGE = 'journal-helper';

    public const array FIELDS = ['driver', 'allowedModels', 'access', 'stopConditions', 'execution'];

    /**
     * @param  list<string>  $allowedModels
     */
    public function __construct(
        public string|null $driver,
        public bool $driverPinned,
        public array $allowedModels,
        public AccessPolicy $access,
        public StopConditions $stopConditions,
        public ExecutionPolicy $execution,
        public ProfileProvenance $provenance,
        public bool $requiresReview = false,
    ) {}

    /**
     * The global defaults of the type for a driver, pinned or open: every policy field from the defaults.
     *
     * @param  list<string>  $allowedModels
     */
    public static function defaultsFor(
        ProfileBase $type,
        string|null $driver,
        bool $driverPinned,
        array $allowedModels,
        string $configurationHash,
    ): self {

        return new self(
            $driver,
            $driverPinned,
            $allowedModels,
            $type->defaultAccess(),
            StopConditions::make($type->defaultStopConditions()),
            self::defaultExecution($type),
            new ProfileProvenance(
                $configurationHash,
                array_map(fn (string $field) => new FieldOrigin($field, PolicyOriginType::GlobalDefault), self::FIELDS),
            ),
        );
    }

    /**
     * Where a type runs by default: on the protected host, or in a required container of the journal's agent image,
     * which the host resolves to its verified digest.
     */
    private static function defaultExecution(ProfileBase $type): ExecutionPolicy
    {
        $mode = $type->defaultExecutionMode();
        $image = $mode === ExecutionModeType::RequiredContainer ? self::HELPER_IMAGE : null;

        return ExecutionPolicy::make($mode, $image, self::WORKSPACE, ExecutionBudgets::defaults(), []);
    }

    /**
     * The hash of the activated configuration this policy came from.
     */
    public function configurationHash(): string
    {
        return $this->provenance->configurationHash;
    }

    public function allowsOperation(Operation $operation): bool
    {
        return $this->access->allows($operation);
    }

    public function decide(Operation $operation): AccessDecision
    {
        return $this->access->decide($operation);
    }

    public function freeze(string|null $profileKey, int|null $revision): StartPolicy
    {
        return new StartPolicy(
            $this->access,
            $this->stopConditions,
            $this->execution,
            $profileKey,
            $revision,
            $this->configurationHash(),
            $this->requiresReview,
        );
    }
}
