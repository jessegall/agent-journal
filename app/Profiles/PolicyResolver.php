<?php

declare(strict_types=1);

namespace App\Profiles;

use App\Access\Contracts\OperationNames;
use App\Access\Contracts\PolicyCatalogue;
use App\Agents\Enums\ExecutionModeType;
use App\Bus\Contracts\Command;
use App\Hosts\ArrangementSetting;
use App\Profiles\Enums\PolicyOriginType;
use App\Profiles\Exceptions\ProfilePolicyRefused;
use App\Profiles\Values\FieldOrigin;
use App\Profiles\Values\HostAccess;
use App\Profiles\Values\ProfileProvenance;
use App\Sessions\Values\ExecutionPolicy;
use App\Sessions\Values\StopConditions;
use App\Support\AgentImage;
use App\Support\CommandRegistry;
use App\Values\AccessPolicy;
use App\Values\ExecutionBudgets;
use App\Values\OperationGrant;
use App\Values\ProfileDefinition;
use App\Values\ProfileKey;
use App\Values\ProfileStartPolicy;
use App\Values\StopCondition;

/**
 * Resolves one proposed profile into the definition an activation stores: the type's defaults, the project's override,
 * then the profile's own. A list left out inherits, a removal clears an inherited grant, a denial always wins, and the
 * result never passes the type's ceiling or a protected area.
 */
final readonly class PolicyResolver
{
    public function __construct(
        private OperationNames $operations,
        private PolicyCatalogue $policies,
        private CommandRegistry $commands,
        private ArrangementSetting $arrangement,
        private AgentImage $image,
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
            $profile->preferredDriver,
            $this->access($profile, $project),
            $this->stopConditions($profile),
            $this->execution($profile),
            ProfileProvenance::from([
                'configuration_hash' => $configurationHash,
                'origins' => [
                    FieldOrigin::from(['field' => 'preferredDriver', 'origin' => PolicyOriginType::Profile]),
                    FieldOrigin::from(['field' => 'access', 'origin' => self::originOf($project, $profile->override)]),
                    FieldOrigin::from([
                        'field' => 'stopConditions',
                        'origin' => $profile->stopConditions === []
                        ? PolicyOriginType::GlobalDefault
                        : PolicyOriginType::Profile,
                    ]),
                    FieldOrigin::from([
                        'field' => 'execution',
                        'origin' => $profile->container === null
                        ? PolicyOriginType::GlobalDefault
                        : PolicyOriginType::Profile,
                    ]),
                ],
            ]),
        );

        return new ProfileDefinition(
            $profile->key,
            $profile->label,
            $profile->base,
            $profile->instructions,
            $profile->tier,
            $profile->skillAllowlist,
            $profile->requiredSkills,
            $start,
            BuiltInAuthorizations::for($profile->base, $this->policies->grantable())
                ->without($profile->withheldGrants)
                ->denying($this->applicationCommands($profile->key, $profile->deniedCommands)),
            $profile->supervisor,
            $profile->instances,
            $profile->description,
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

        foreach ([
            $project,
            $profile->override,
        ] as $override) {
            $rules = $override->appliedTo($rules);

            $grants = [
                ...array_filter($grants, fn (OperationGrant $grant) => ! in_array(
                    $grant->operation,
                    $override->removeOperations,
                    true,
                )),
                ...array_map(fn (OperationRule $rule) => $rule->grant(), $override->allowOperations),
            ];

            $denials = [
                ...$denials,
                ...$override->denyOperations,
            ];
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

        return StopConditions::from(['conditions' => $conditions]);
    }

    /**
     * @throws ProfilePolicyRefused
     */
    private function execution(ProposedProfile $profile): ExecutionPolicy
    {
        $type = $profile->base;

        if ($this->arrangement->arrangement->isContained()) {
            return new ExecutionPolicy(
                ExecutionModeType::RequiredContainer,
                $this->image->reference,
                ProfileStartPolicy::WORKSPACE,
                $type->containedBudgets,
                [],
                $type->isAttachable(),
            );
        }

        $mode = $profile->container ?? $type->defaultExecutionMode();

        if ($type->isContainerRequired() && $mode !== ExecutionModeType::RequiredContainer) {
            throw ProfilePolicyRefused::writerOutsideContainer($profile->key);
        }

        $image = $mode === ExecutionModeType::RequiredContainer ? $this->image->reference : null;

        return ExecutionPolicy::from([
            'mode' => $mode,
            'image_reference' => $image,
            'worktree' => ProfileStartPolicy::WORKSPACE,
            'budgets' => ExecutionBudgets::defaults(),
            'network_capabilities' => [],
        ]);
    }

    /**
     * @throws ProfilePolicyRefused
     */
    private function assertKnownOperations(ProposedProfile $profile, PolicyOverride $project): void
    {
        foreach ([
            ...$project->operationNames(),
            ...$profile->override->operationNames(),
        ] as $operation) {
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
            if ($this->commands->applicationAuthorizeOf($command)->isEmpty()) {
                throw ProfilePolicyRefused::unknownCommand($key, $command);
            }
        }

        /**
         * @var list<class-string<Command<mixed>>> $commands
         */
        return $commands;
    }
}
