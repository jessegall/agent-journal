<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Enums\ExecutionModeType;
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

/**
 * How an access policy, stop conditions and an execution policy are stored, as the plain arrays a JSON column holds,
 * shared by a profile revision and a session's frozen policy so both read the same shape.
 */
final class StoredPolicies
{
    /**
     * @return array<string, mixed>
     */
    public static function accessToArray(AccessPolicy $access): array
    {
        return [
            'class_grants' => array_map(fn (ClassGrant $grant) => [
                'area' => $grant->area->value,
                'access' => array_map(fn (AccessType $access) => $access->value, $grant->accessTypes),
            ], $access->classGrants),
            'operation_grants' => array_map(fn (OperationGrant $grant) => [
                'operation' => $grant->operation,
                'resources' => array_map(fn (ResourceRequest $resource) => [
                    'area' => $resource->area->value,
                    'target' => $resource->target,
                ], $grant->resources),
            ], $access->operationGrants),
            'denials' => $access->denials,
            'paths' => $access->paths,
            'destinations' => $access->destinations,
            'processes' => self::processesStored($access->processes),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function stopConditionsToArray(StopConditions $conditions): array
    {
        return [
            'attempt_seconds' => $conditions->attemptSeconds,
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
            ], $conditions->conditions),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function executionToArray(ExecutionPolicy $execution): array
    {
        return [
            'mode' => $execution->mode->value,
            'image' => $execution->imageReference,
            'worktree' => $execution->worktree,
            'budgets' => (array) $execution->budgets,
            'network' => $execution->networkCapabilities,
        ];
    }

    /**
     * @param  array<string, mixed>  $stored
     */
    public static function accessFrom(array $stored): AccessPolicy
    {
        return AccessPolicy::make(
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
            self::processesFrom($stored['processes']),
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
    private static function processesFrom(array $stored): ProcessGrants
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
    public static function stopConditionsFrom(array $stored): StopConditions
    {
        return StopConditions::make(array_values(array_map(fn (array $condition) => new StopCondition(
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
    public static function executionFrom(array $stored): ExecutionPolicy
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
}
