<?php

declare(strict_types=1);

namespace App\Agents\Values;

use App\Agents\Enums\AccessRuleType;
use App\Agents\Enums\AgentRole;
use App\Agents\Exceptions\AccessPolicyInvalid;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;

/**
 * What one role may do: access types per resource area, exact operation grants, explicit denials, the paths and
 * destinations it is held to, and the role whose ceiling it can never pass. Protected resources are never granted.
 */
final readonly class AccessPolicy
{
    private const array LOOKING = [AccessType::Read, AccessType::Search];

    private const array CHANGING = [AccessType::Create, AccessType::Edit, AccessType::Delete];

    private const array RUNNING = [AccessType::Execute, AccessType::Test, AccessType::Build];

    /**
     * @param  list<ClassGrant>  $classGrants
     * @param  list<OperationGrant>  $operationGrants
     * @param  list<string>  $denials  operation names that are refused whatever else grants them
     * @param  list<string>  $paths  the workspace paths the policy is held to
     * @param  list<string>  $destinations  the network destinations it may reach
     */
    private function __construct(
        public AgentRole $role,
        public array $classGrants,
        public array $operationGrants,
        public array $denials,
        public array $paths,
        public array $destinations,
    ) {}

    /**
     * @param  list<ClassGrant>  $classGrants
     * @param  list<OperationGrant>  $operationGrants
     * @param  list<string>  $denials
     * @param  list<string>  $paths
     * @param  list<string>  $destinations
     *
     * @throws AccessPolicyInvalid
     */
    public static function make(AgentRole $role, array $classGrants, array $operationGrants, array $denials, array $paths, array $destinations): self
    {
        foreach ($classGrants as $grant) {
            if ($grant->area === ResourceAreaType::Protected) {
                throw AccessPolicyInvalid::protectedGrant($role);
            }

            foreach ($grant->accessTypes as $access) {
                if ($role === AgentRole::ReadOnlyHelper && $grant->area->hasWorkspaceFiles() && $access->changesFiles()) {
                    throw AccessPolicyInvalid::aboveCeiling($role, $access, $grant->area);
                }
            }
        }

        return new self($role, $classGrants, $operationGrants, $denials, $paths, $destinations);
    }

    /**
     * The global defaults of a role (doc 14, section 51); a project and a profile only override them.
     */
    public static function defaultsFor(AgentRole $role): self
    {
        $journal = [AccessType::Read, AccessType::Search, AccessType::Create, AccessType::Edit];

        $grants = match ($role) {
            AgentRole::MainAgent => [
                new ClassGrant(ResourceAreaType::Workspace, [...self::LOOKING, ...self::CHANGING, ...self::RUNNING]),
                new ClassGrant(ResourceAreaType::JournalContent, [...self::LOOKING, ...self::CHANGING]),
                new ClassGrant(ResourceAreaType::JournalWork, [...self::LOOKING, ...self::CHANGING, AccessType::Delegate]),
                new ClassGrant(ResourceAreaType::JournalControl, self::LOOKING),
            ],
            AgentRole::ReadOnlyHelper => [
                new ClassGrant(ResourceAreaType::Workspace, [...self::LOOKING, AccessType::Execute]),
                new ClassGrant(ResourceAreaType::JournalContent, $journal),
                new ClassGrant(ResourceAreaType::JournalWork, $journal),
            ],
            AgentRole::WritingHelper => [
                new ClassGrant(ResourceAreaType::Workspace, [...self::LOOKING, ...self::CHANGING, ...self::RUNNING]),
                new ClassGrant(ResourceAreaType::Scratch, [...self::LOOKING, ...self::CHANGING, ...self::RUNNING]),
                new ClassGrant(ResourceAreaType::JournalContent, $journal),
                new ClassGrant(ResourceAreaType::JournalWork, $journal),
            ],
        };

        return self::make($role, $grants, [], [], [], []);
    }

    /**
     * Decides one operation: an explicit denial or a protected resource refuses first, an exact grant allows, and
     * otherwise every access it needs must be granted on every area it touches.
     */
    public function decide(Operation $operation): AccessDecision
    {
        if (in_array($operation->name, $this->denials, true)) {
            return AccessDecision::refused(AccessRuleType::ExplicitDenial, "The policy denies {$operation->name}.");
        }

        if ($operation->touches(ResourceAreaType::Protected)) {
            return AccessDecision::refused(AccessRuleType::ProtectedArea, "{$operation->name} reaches a protected resource, which no policy grants.");
        }

        if ($operation->accessTypes === []) {
            return AccessDecision::refused(AccessRuleType::Unclassified, "{$operation->name} declares no access, so it cannot be granted.");
        }

        if (array_any($this->operationGrants, fn (OperationGrant $grant): bool => $grant->covers($operation))) {
            return AccessDecision::allowed(AccessRuleType::OperationGrant, "{$operation->name} is granted by name.");
        }

        foreach ($operation->resources as $resource) {
            foreach ($operation->accessTypes as $access) {
                if (! $this->grants($access, $resource->area)) {
                    return AccessDecision::refused(AccessRuleType::NotGranted, "{$operation->name} needs {$access->value} on {$resource->area->value}, which this policy does not grant.");
                }
            }
        }

        return AccessDecision::allowed(AccessRuleType::ClassGrant, "Every access {$operation->name} needs is granted on the areas it touches.");
    }

    public function grants(AccessType $access, ResourceAreaType $area): bool
    {
        return array_any($this->classGrants, fn (ClassGrant $grant): bool => $grant->grants($access, $area));
    }
}
