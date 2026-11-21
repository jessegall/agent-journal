<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Actors\Contracts\PolicyCatalogue;
use App\Agents\Enums\ExecutionModeType;
use App\Agents\Values\AccessPolicy;
use App\Agents\Values\ExecutionBudgets;
use App\Agents\Values\ExecutionPolicy;
use App\Agents\Values\HostAccess;
use App\Agents\Values\OperationGrant;
use App\Agents\Values\StopCondition;
use App\Agents\Values\StopConditions;
use App\Bus\Contracts\Command;
use App\Bus\Support\CommandRegistry;
use App\Profiles\Contracts\OperationNames;
use App\Profiles\Enums\PolicyOriginType;
use App\Profiles\Exceptions\ProfilePolicyRefused;
use App\Profiles\Values\FieldOrigin;
use App\Profiles\Values\ProfileDefinition;
use App\Profiles\Values\ProfileKey;
use App\Profiles\Values\ProfileProvenance;
use App\Profiles\Values\ProfileStartPolicy;

/**
 * Resolves one proposed profile into the definition an activation stores: the type's global defaults, then the
 * project's override of the type, then the profile's own. A list left out inherits and an empty one adds nothing; a
 * removal clears an inherited grant; a denial, from either override, always wins, and the project's denials cannot be
 * removed. The result never passes the type's ceiling or a protected area.
 */
final readonly class PolicyResolver
{
    public function __construct(
        private OperationNames $operations,
        private PolicyCatalogue $policies,
        private CommandRegistry $commands,
    ) {}

    /**
     * @throws ProfilePolicyRefused
     */
    public function resolve(
        ProfileProposal $proposal,
        ProposedProfile $profile,
        string $configurationHash,
    ): ProfileDefinition {
        $project = $proposal->overrideFor($profile->base);
        $this->assertKnownOperations($profile, $project);

        $start = new ProfileStartPolicy(
            $profile->program,
            $profile->programPinned,
            $profile->allowedModels,
            $this->access($profile, $project),
            $this->stopConditions($profile),
            $this->execution($profile),
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
            $profile->base,
            $profile->instructions,
            $profile->model,
            $profile->skillAllowlist,
            $profile->requiredSkills,
            $start,
            BuiltInAuthorizations::for($profile->base, $this->policies->grantable())
                ->without($profile->withheldGrants)
                ->denying($this->applicationCommands($profile->key, $profile->deniedCommands)),
            $profile->supervisor,
            $profile->instances,
        );
    }

    /**
     * @throws ProfilePolicyRefused
     */
    private function access(ProposedProfile $profile, PolicyOverride $project): AccessPolicy
    {
        $defaults = $profile->base->defaultAccess();
        $rules = [];

        foreach ($defaults->paths as $scope) {
            foreach ($scope->accesses as $access) {
                $rules[] = new RootRule($access, $scope->scope);
            }
        }

        $grants = [];
        $denials = [];

        foreach ([$project, $profile->override] as $override) {
            $rules = $override->appliedTo($rules);
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

        $this->assertWithinCeiling($profile, $rules);

        return new AccessPolicy(
            self::roots($rules),
            $defaults->destinations,
            $defaults->processes,
            $grants,
            array_values(array_unique($denials)),
        );
    }

    /**
     * The type's conditions, then the profile's; a condition the profile repeats by key is kept once when it is the
     * same, and refused when it differs.
     *
     * @throws ProfilePolicyRefused
     */
    private function stopConditions(ProposedProfile $profile): StopConditions
    {
        $conditions = $profile->base->defaultStopConditions();

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

        return StopConditions::make($conditions);
    }

    /**
     * @throws ProfilePolicyRefused
     */
    private function execution(ProposedProfile $profile): ExecutionPolicy
    {
        $type = $profile->base;
        $mode = $profile->container ?? $type->defaultExecutionMode();

        if ($type->isContainerRequired() && $mode !== ExecutionModeType::RequiredContainer) {
            throw ProfilePolicyRefused::writerOutsideContainer($profile->key);
        }

        $image = $mode === ExecutionModeType::RequiredContainer ? ProfileStartPolicy::HELPER_IMAGE : null;

        return ExecutionPolicy::make(
            $mode,
            $image,
            ProfileStartPolicy::WORKSPACE,
            ExecutionBudgets::defaults(),
            [],
        );
    }

    /**
     * @throws ProfilePolicyRefused
     */
    private function assertKnownOperations(ProposedProfile $profile, PolicyOverride $project): void
    {
        foreach ([...$project->operationNames(), ...$profile->override->operationNames()] as $operation) {
            if (! $this->operations->has($operation)) {
                throw ProfilePolicyRefused::unknownOperation($profile->key, $operation);
            }
        }
    }

    /**
     * @param  list<RootRule>  $rules
     *
     * @throws ProfilePolicyRefused
     */
    private function assertWithinCeiling(ProposedProfile $profile, array $rules): void
    {
        foreach ($rules as $rule) {
            if ($rule->isProtected()) {
                throw ProfilePolicyRefused::protectedArea($profile->key);
            }

            if ($rule->access->changesFiles() && ! $profile->base->mayChangeWorkspaceFiles()) {
                throw ProfilePolicyRefused::readOnlyCeiling($profile->key);
            }
        }
    }

    /**
     * @param  list<RootRule>  $rules
     * @return list<HostAccess>
     */
    private static function roots(array $rules): array
    {
        $accesses = [];

        foreach ($rules as $rule) {
            $accesses[$rule->root][] = $rule->access;
        }

        return array_map(
            fn (string $root) => HostAccess::root($root, $accesses[$root]),
            array_keys($accesses),
        );
    }

    private static function originOf(PolicyOverride $project, PolicyOverride $profile): PolicyOriginType
    {
        return match (true) {
            $profile->changesAccess() => PolicyOriginType::Profile,
            $project->changesAccess() => PolicyOriginType::ProjectType,
            default => PolicyOriginType::GlobalDefault,
        };
    }

    /**
     * The denied commands, each a registered application command; an unknown or trusted one is refused.
     *
     * @param  list<string>  $commands
     * @return list<class-string<Command<mixed>>>
     *
     * @throws ProfilePolicyRefused
     */
    private function applicationCommands(ProfileKey $key, array $commands): array
    {
        foreach ($commands as $command) {
            if (! $this->commands->has($command) || $this->commands->authorizeOf($command) === null) {
                throw ProfilePolicyRefused::unknownCommand($key, $command);
            }
        }

        /**
         * @var list<class-string<Command<mixed>>> $commands
         */
        return $commands;
    }
}
