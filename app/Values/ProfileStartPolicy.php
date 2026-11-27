<?php

declare(strict_types=1);

namespace App\Values;

use App\Agents\Enums\ExecutionModeType;
use App\Profiles\Enums\PolicyOriginType;
use App\Profiles\Values\FieldOrigin;
use App\Profiles\Values\ProfileProvenance;
use App\Sessions\Values\ExecutionPolicy;
use App\Sessions\Values\StartPolicy;
use App\Sessions\Values\StopConditions;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * How a profile's agent is started: its driver and whether a start may choose another, the models it allows (none
 * listed allows any), what it may do, the conditions it must pass before it stops, where it runs, and where each of
 * those came from. The worktree of its execution policy is the type's placeholder, which the host resolves per start.
 */
#[MapName(SnakeCaseMapper::class)]
final class ProfileStartPolicy extends Data
{
    public const string WORKSPACE = 'workspace';

    public const string HELPER_IMAGE = 'journal-helper';

    public const array FIELDS = [
        'preferredDriver',
        'access',
        'stopConditions',
        'execution',
    ];

    /**
     * @param  string|null  $preferredDriver  the driver family a start preselects; any start may choose another
     */
    public function __construct(
        public readonly string|null $preferredDriver,
        public readonly AccessPolicy $access,
        public readonly StopConditions $stopConditions,
        public readonly ExecutionPolicy $execution,
        public readonly ProfileProvenance $provenance,
    ) {}

    /**
     * The global defaults of the type for a preferred driver: every policy field from the defaults.
     */
    public static function defaultsFor(ProfileBase $type, string|null $preferredDriver, string $configurationHash): self
    {
        return new self(
            $preferredDriver,
            $type->defaultAccess(),
            StopConditions::from(['conditions' => $type->defaultStopConditions()]),
            self::defaultExecution($type),
            ProfileProvenance::from([
                'configuration_hash' => $configurationHash,
                'origins' => array_map(fn (string $field) => FieldOrigin::from(['field' => $field, 'origin' => PolicyOriginType::GlobalDefault]), self::FIELDS),
            ]),
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

        return new ExecutionPolicy($mode, $image, self::WORKSPACE, ExecutionBudgets::defaults(), []);
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
        );
    }
}
