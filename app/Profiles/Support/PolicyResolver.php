<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Agents\Enums\AgentRole;
use App\Agents\Enums\ExecutionModeType;
use App\Agents\Support\ExecutionBudgets;
use App\Agents\Support\ExecutionPolicy;
use App\Agents\Values\AccessPolicy;
use App\Agents\Values\ClassGrant;
use App\Agents\Values\OperationGrant;
use App\Agents\Values\StopCondition;
use App\Agents\Values\StopConditions;
use App\Operations\Enums\ResourceAreaType;
use App\Profiles\Contracts\KnownOperations;
use App\Profiles\Enums\PolicyOriginType;
use App\Profiles\Exceptions\ProfilePolicyRefused;
use App\Profiles\Values\FieldOrigin;
use App\Profiles\Values\ProfileDefinition;
use App\Profiles\Values\ProfileLaunchPolicy;
use App\Profiles\Values\ProfileProvenance;

/**
 * Resolves one proposed profile into the definition an activation stores: the type's global defaults, then the
 * project's override of the type, then the profile's own. A list left out inherits and an empty one adds nothing; a
 * removal clears an inherited grant; a denial, from either override, always wins, and the project's denials cannot be
 * removed. The result never passes the type's ceiling or a protected area.
 */
final readonly class PolicyResolver
{
    public function __construct(private KnownOperations $operations) {}

    /**
     * @throws ProfilePolicyRefused
     */
    public function resolve(
        ProfileProposal $proposal,
        ProposedProfile $profile,
        string $configurationHash,
    ): ProfileDefinition {
        $role = $profile->type->agentRole();
        $project = $proposal->overrideFor($profile->type);
        $this->requireKnownOperations($profile, $project);

        $launch = new ProfileLaunchPolicy(
            $profile->program,
            $profile->programPinned,
            $profile->allowedModels,
            $this->access($role, $profile, $project),
            $this->stopConditions($role, $profile),
            $this->execution($role, $profile),
            new ProfileProvenance($configurationHash, [
                new FieldOrigin('program', PolicyOriginType::Profile),
                new FieldOrigin('allowedModels', PolicyOriginType::Profile),
                new FieldOrigin('access', self::originOf($project, $profile->override)),
                new FieldOrigin('stopConditions', $profile->stopConditions === []
                    ? PolicyOriginType::GlobalDefault
                    : PolicyOriginType::Profile),
                new FieldOrigin('execution', $profile->container === null
                    ? PolicyOriginType::GlobalDefault
                    : PolicyOriginType::Profile),
            ]),
        );

        return new ProfileDefinition(
            $profile->key,
            $profile->label,
            $profile->type,
            $profile->instructions,
            $profile->model,
            $profile->skillAllowlist,
            $profile->requiredSkills,
            $launch,
            BuiltInAuthorizations::for($profile->type),
        );
    }

    /**
     * @throws ProfilePolicyRefused
     */
    private function access(AgentRole $role, ProposedProfile $profile, PolicyOverride $project): AccessPolicy
    {
        $classes = [];

        foreach (AccessPolicy::defaultsFor($role)->classGrants as $grant) {
            foreach ($grant->accessTypes as $access) {
                $classes[] = new ClassRule($access, $grant->area);
            }
        }

        $grants = [];
        $denials = [];

        foreach ([$project, $profile->override] as $override) {
            $classes = $override->appliedTo($classes);
            $grants = [
                ...array_filter($grants, fn (OperationGrant $grant) => ! in_array(
                    $grant->operation,
                    $override->removeOperations,
                    true,
                )),
                ...array_map(fn (OperationRule $rule) => $rule->grant(), $override->allowOperations),
            ];
            $denials = [...$denials, ...$override->denyOperations];
        }

        $this->requireWithinCeiling($role, $profile, $classes);

        return AccessPolicy::make(
            $role,
            self::classGrants($classes),
            $grants,
            array_values(array_unique($denials)),
            [],
            [],
        );
    }

    /**
     * The type's conditions, then the profile's; a condition the profile repeats by key is kept once when it is the
     * same, and refused when it differs.
     *
     * @throws ProfilePolicyRefused
     */
    private function stopConditions(AgentRole $role, ProposedProfile $profile): StopConditions
    {
        $conditions = StopConditions::defaultsFor($role)->conditions;

        foreach ($profile->stopConditions as $condition) {
            $same = array_filter($conditions, fn (StopCondition $kept) => $kept->key === $condition->key);

            if ($same === []) {
                $conditions[] = $condition;

                continue;
            }

            if ($same[array_key_first($same)] != $condition) {
                throw ProfilePolicyRefused::conflictingCondition($profile->key, $condition->key);
            }
        }

        return StopConditions::make($role, $conditions);
    }

    /**
     * @throws ProfilePolicyRefused
     */
    private function execution(AgentRole $role, ProposedProfile $profile): ExecutionPolicy
    {
        $mode = $profile->container ?? $role->defaultExecutionMode();

        if ($role === AgentRole::WritingHelper && $mode !== ExecutionModeType::RequiredContainer) {
            throw ProfilePolicyRefused::writerOutsideContainer($profile->key);
        }

        $image = $mode === ExecutionModeType::RequiredContainer ? ProfileLaunchPolicy::HELPER_IMAGE : null;

        return ExecutionPolicy::make(
            $role,
            $mode,
            $image,
            ProfileLaunchPolicy::WORKSPACE,
            ExecutionBudgets::defaults(),
            [],
        );
    }

    /**
     * @throws ProfilePolicyRefused
     */
    private function requireKnownOperations(ProposedProfile $profile, PolicyOverride $project): void
    {
        foreach ([...$project->operationNames(), ...$profile->override->operationNames()] as $operation) {
            if (! $this->operations->has($operation)) {
                throw ProfilePolicyRefused::unknownOperation($profile->key, $operation);
            }
        }
    }

    /**
     * @param  list<ClassRule>  $classes
     *
     * @throws ProfilePolicyRefused
     */
    private function requireWithinCeiling(AgentRole $role, ProposedProfile $profile, array $classes): void
    {
        foreach ($classes as $class) {
            if ($class->area === ResourceAreaType::Protected) {
                throw ProfilePolicyRefused::protectedArea($profile->key);
            }

            $writes = $class->area->hasWorkspaceFiles() && $class->access->changesFiles();

            if ($role === AgentRole::ReadOnlyHelper && $writes) {
                throw ProfilePolicyRefused::readOnlyCeiling($profile->key);
            }
        }
    }

    /**
     * @param  list<ClassRule>  $classes
     * @return list<ClassGrant>
     */
    private static function classGrants(array $classes): array
    {
        $areas = [];

        foreach ($classes as $class) {
            $areas[$class->area->value][] = $class->access;
        }

        $grants = [];

        foreach ($areas as $area => $access) {
            $grants[] = new ClassGrant(ResourceAreaType::from($area), $access);
        }

        return $grants;
    }

    private static function originOf(PolicyOverride $project, PolicyOverride $profile): PolicyOriginType
    {
        return match (true) {
            $profile->changesAccess() => PolicyOriginType::Profile,
            $project->changesAccess() => PolicyOriginType::ProjectType,
            default => PolicyOriginType::GlobalDefault,
        };
    }
}
