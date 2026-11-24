<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\AccessRuleType;
use App\Enums\ResourceType;

/**
 * What one profile may do on the host: root paths and destinations with the accesses each permits, process ceilings,
 * exact host operation grants and explicit denials. A protected path is never granted, and a journal grant never
 * widens any of this.
 */
final readonly class AccessPolicy
{
    /**
     * Files no profile may touch wherever they lie, whatever grants them: the drivers' own sign-ins.
     */
    public const array PROTECTED_PATHS = ['.claude/.credentials.json', '.codex/auth.json'];

    /**
     * @param  list<HostAccess>  $paths
     * @param  list<HostAccess>  $destinations
     * @param  list<OperationGrant>  $operationGrants
     * @param  list<string>  $denials  host operation and read names refused whatever else grants them
     */
    public function __construct(
        public array $paths,
        public array $destinations,
        public ProcessGrants $processes,
        public array $operationGrants = [],
        public array $denials = [],
    ) {}

    public function allows(Operation $operation): bool
    {
        return $this->decide($operation)->isAllowed;
    }

    /**
     * Decides one host operation: an explicit denial, a protected path or an operand that cannot be judged refuses
     * first, an exact grant allows, and otherwise every operand must lie in a scope permitting every access needed.
     */
    public function decide(Operation $operation): AccessDecision
    {
        if (in_array($operation->name, $this->denials, true)) {
            return AccessDecision::refused(
                AccessRuleType::ExplicitDenial,
                AgentText::of('core.access.policy_denies', ['operation' => $operation->name]),
            );
        }

        if (array_any($operation->resources, self::isProtected(...))) {
            return AccessDecision::refused(
                AccessRuleType::ProtectedPath,
                AgentText::of('core.access.protected_path', ['operation' => $operation->name]),
            );
        }

        if ($operation->accessTypes === [] || array_any(
            $operation->resources,
            fn (ResourceRequest $resource) => $resource->isUnknown(),
        )) {
            return AccessDecision::refused(
                AccessRuleType::Unclassified,
                AgentText::of('core.access.unclassified', ['operation' => $operation->name]),
            );
        }

        if (array_any($this->operationGrants, fn (OperationGrant $grant): bool => $grant->covers($operation))) {
            return AccessDecision::allowed(
                AccessRuleType::OperationGrant,
                AgentText::of('core.access.granted_by_name', ['operation' => $operation->name]),
            );
        }

        foreach ($operation->resources as $resource) {
            $scope = array_find($this->scopesFor($resource), fn (HostAccess $scope) => $scope->covers($resource));

            foreach ($operation->accessTypes as $access) {
                if ($scope === null || ! $scope->permits($access)) {
                    return AccessDecision::refused(
                        AccessRuleType::NotGranted,
                        AgentText::of('core.access.scope_missing', [
                            'operation' => $operation->name,
                            'access' => $access->value,
                            'target' => $resource->target,
                        ]),
                    );
                }
            }
        }

        return AccessDecision::allowed(
            AccessRuleType::ScopeGrant,
            AgentText::of('core.access.granted_where_it_acts', ['operation' => $operation->name]),
        );
    }

    /**
     * Whether a profile under this policy may change workspace files at all.
     */
    public function changesFiles(): bool
    {
        return array_any($this->paths, fn (HostAccess $scope) => $scope->changesFiles());
    }

    /**
     * Whether the other policy grants nothing this one does not: every scope and exact grant held here, every denial
     * kept, and its processes within these. What cannot be proved contained is not.
     */
    public function contains(self $other): bool
    {
        return self::scopesContain($this->paths, $other->paths)
            && self::scopesContain($this->destinations, $other->destinations)
            && array_all($other->operationGrants, fn (OperationGrant $grant): bool => in_array(
                $grant,
                $this->operationGrants,
            ))
            && array_all($this->denials, fn (string $denial): bool => in_array($denial, $other->denials, true))
            && $this->processes->contains($other->processes);
    }

    /**
     * @return list<HostAccess>
     */
    private function scopesFor(ResourceRequest $resource): array
    {
        if ($resource->type === ResourceType::Destination) {
            return $this->destinations;
        }

        return $this->paths;
    }

    private static function isProtected(ResourceRequest $resource): bool
    {
        if ($resource->type !== ResourceType::Path) {
            return false;
        }

        $path = $resource->normalizedPath();

        return array_any(
            self::PROTECTED_PATHS,
            fn (string $protected) => $path === $protected || str_ends_with($path, '/'.$protected),
        );
    }

    /**
     * @param  list<HostAccess>  $wider
     * @param  list<HostAccess>  $narrower
     */
    private static function scopesContain(array $wider, array $narrower): bool
    {
        return array_all(
            $narrower,
            fn (HostAccess $scope) => array_any($wider, fn (HostAccess $held) => $held->contains($scope)),
        );
    }
}
