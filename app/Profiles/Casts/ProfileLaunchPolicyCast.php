<?php

declare(strict_types=1);

namespace App\Profiles\Casts;

use App\Agents\Enums\AgentRole;
use App\Agents\Enums\ExecutionModeType;
use App\Agents\Support\ExecutionBudgets;
use App\Agents\Support\ExecutionPolicy;
use App\Agents\Values\AccessPolicy;
use App\Agents\Values\ClassGrant;
use App\Agents\Values\OperationGrant;
use App\Agents\Values\ResourceRequest;
use App\Agents\Values\StopCondition;
use App\Agents\Values\StopConditions;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Processes\Values\CommandClassSet;
use App\Processes\Values\CommandPatternSet;
use App\Processes\Values\ProcessGrants;
use App\Profiles\Enums\PolicyOriginType;
use App\Profiles\Enums\ProfileType;
use App\Profiles\Exceptions\ProfileRevisionUnreadable;
use App\Profiles\Values\FieldOrigin;
use App\Profiles\Values\ProfileLaunchPolicy;
use App\Profiles\Values\ProfileProvenance;
use App\Programs\Enums\HookProgram;
use ErrorException;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;
use InvalidArgumentException;
use JsonException;
use TypeError;
use ValueError;

/**
 * Stores a revision's launch policy in its own columns (program, whether it is pinned, allowed models, the policies,
 * the configuration hash and provenance) and rebuilds it through the policies' own checks when read. A column that no
 * longer reads fails the read rather than stand in for a default.
 *
 * @implements CastsAttributes<ProfileLaunchPolicy, ProfileLaunchPolicy>
 */
final class ProfileLaunchPolicyCast implements CastsAttributes
{
    /**
     * @param  array<string, mixed>  $attributes
     *
     * @throws ProfileRevisionUnreadable
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): ProfileLaunchPolicy
    {
        try {
            $role = ProfileType::from((string) $attributes['type'])->agentRole();

            return new ProfileLaunchPolicy(
                HookProgram::tryFrom((string) $attributes['program']),
                (bool) $attributes['program_pinned'],
                self::decode($attributes['allowed_models']),
                self::access($role, self::decode($attributes['access_policy'])),
                self::stopConditions($role, self::decode($attributes['stop_conditions'])),
                self::execution(self::decode($attributes['execution_policy'])),
                self::provenance((string) $attributes['configuration_hash'], self::decode($attributes['provenance'])),
            );
        } catch (JsonException|InvalidArgumentException|TypeError|ValueError|ErrorException $failure) {
            throw ProfileRevisionUnreadable::forRevision((string) $model->getKey(), $failure);
        }
    }

    /**
     * @param  ProfileLaunchPolicy  $value
     * @param  array<string, mixed>  $attributes
     * @return array<string, string|bool|null>
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): array
    {
        return [
            'program' => $value->program?->value,
            'program_pinned' => $value->programPinned,
            'allowed_models' => self::encode($value->allowedModels),
            'access_policy' => self::encode([
                'class_grants' => array_map(fn (ClassGrant $grant) => [
                    'area' => $grant->area->value,
                    'access' => array_map(fn (AccessType $access) => $access->value, $grant->accessTypes),
                ], $value->access->classGrants),
                'operation_grants' => array_map(fn (OperationGrant $grant) => [
                    'operation' => $grant->operation,
                    'resources' => array_map(fn (ResourceRequest $resource) => [
                        'area' => $resource->area->value,
                        'target' => $resource->target,
                    ], $grant->resources),
                ], $value->access->operationGrants),
                'denials' => $value->access->denials,
                'paths' => $value->access->paths,
                'destinations' => $value->access->destinations,
                'processes' => self::processesStored($value->access->processes),
            ]),
            'stop_conditions' => self::encode([
                'attempt_seconds' => $value->stopConditions->attemptSeconds,
                'conditions' => array_map(fn (StopCondition $condition) => [
                    'key' => $condition->key,
                    'label' => $condition->label,
                    'executable' => $condition->executable,
                    'arguments' => $condition->arguments,
                    'access' => array_map(fn (AccessType $access) => $access->value, $condition->accessTypes),
                    'directory' => $condition->directory,
                    'timeout_seconds' => $condition->timeoutSeconds,
                    'output_bytes' => $condition->outputBytes,
                    'guidance' => $condition->guidance,
                ], $value->stopConditions->conditions),
            ]),
            'execution_policy' => self::encode([
                'mode' => $value->execution->mode->value,
                'image' => $value->execution->imageReference,
                'worktree' => $value->execution->worktree,
                'budgets' => (array) $value->execution->budgets,
                'network' => $value->execution->networkCapabilities,
            ]),
            'configuration_hash' => $value->provenance->configurationHash,
            'provenance' => self::encode(array_map(
                fn (FieldOrigin $origin) => ['field' => $origin->field, 'origin' => $origin->origin->value],
                $value->provenance->origins,
            )),
        ];
    }

    /**
     * @param  array<string, mixed>  $stored
     */
    private static function access(AgentRole $role, array $stored): AccessPolicy
    {
        return AccessPolicy::make(
            $role,
            array_values(array_map(fn (array $grant) => new ClassGrant(
                ResourceAreaType::from($grant['area']),
                array_values(array_map(AccessType::from(...), $grant['access'])),
            ), $stored['class_grants'])),
            array_values(array_map(fn (array $grant) => new OperationGrant(
                $grant['operation'],
                array_values(array_map(
                    fn (array $resource) => new ResourceRequest(
                        ResourceAreaType::from($resource['area']),
                        $resource['target'],
                    ),
                    $grant['resources'],
                )),
            ), $stored['operation_grants'])),
            $stored['denials'],
            $stored['paths'],
            $stored['destinations'],
            self::processes($stored['processes']),
        );
    }

    /**
     * @return array{allowed: list<string>, denied: list<string>, ceiling: list<string>,
     *     allowed_patterns: list<list<string>>, denied_patterns: list<list<string>>}
     */
    private static function processesStored(ProcessGrants $grants): array
    {
        return [
            'allowed' => $grants->allowed->toArray(),
            'denied' => $grants->denied->toArray(),
            'ceiling' => $grants->ceiling->toArray(),
            'allowed_patterns' => $grants->allowedPatterns->toArray(),
            'denied_patterns' => $grants->deniedPatterns->toArray(),
        ];
    }

    /**
     * @param  array{allowed: list<string>, denied: list<string>, ceiling: list<string>,
     *     allowed_patterns: list<list<string>>, denied_patterns: list<list<string>>}  $stored
     */
    private static function processes(array $stored): ProcessGrants
    {
        return new ProcessGrants(
            CommandClassSet::fromArray($stored['allowed']),
            CommandClassSet::fromArray($stored['denied']),
            CommandClassSet::fromArray($stored['ceiling']),
            CommandPatternSet::fromArray($stored['allowed_patterns']),
            CommandPatternSet::fromArray($stored['denied_patterns']),
        );
    }

    /**
     * @param  array<string, mixed>  $stored
     */
    private static function stopConditions(AgentRole $role, array $stored): StopConditions
    {
        return StopConditions::make($role, array_values(array_map(fn (array $condition) => new StopCondition(
            $condition['key'],
            $condition['label'],
            $condition['executable'],
            $condition['arguments'],
            array_values(array_map(AccessType::from(...), $condition['access'])),
            $condition['directory'],
            $condition['timeout_seconds'],
            $condition['output_bytes'],
            $condition['guidance'],
        ), $stored['conditions'])), $stored['attempt_seconds']);
    }

    /**
     * @param  array<string, mixed>  $stored
     */
    private static function execution(array $stored): ExecutionPolicy
    {
        $budgets = $stored['budgets'];

        return ExecutionPolicy::make(
            ExecutionModeType::from($stored['mode']),
            $stored['image'],
            $stored['worktree'],
            ExecutionBudgets::make(
                $budgets['cpuCores'],
                $budgets['memoryBytes'],
                $budgets['memorySwapBytes'],
                $budgets['processes'],
                $budgets['openFiles'],
                $budgets['tmpBytes'],
                $budgets['workspaceBytes'],
                $budgets['wallSeconds'],
            ),
            $stored['network'],
        );
    }

    /**
     * @param  list<array{field: string, origin: string}>  $origins
     */
    private static function provenance(string $configurationHash, array $origins): ProfileProvenance
    {
        return new ProfileProvenance($configurationHash, array_map(
            fn (array $origin) => new FieldOrigin($origin['field'], PolicyOriginType::from($origin['origin'])),
            $origins,
        ));
    }

    /**
     * The column's JSON; a value that is no object or list fails where it is used as one.
     *
     * @throws JsonException
     */
    private static function decode(mixed $column): mixed
    {
        return json_decode((string) $column, true, 16, JSON_THROW_ON_ERROR);
    }

    /**
     * @param  array<array-key, mixed>  $value
     */
    private static function encode(array $value): string
    {
        return json_encode($value, JSON_THROW_ON_ERROR);
    }
}
