<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\ReadEntitlements;
use App\Actors\Enums\ReadEntitlementType;
use App\Agents\Contracts\CurrentSession;
use App\Agents\Contracts\ReadAdmission;
use App\Agents\Enums\AccessRuleType;
use App\Agents\Values\AccessDecision;
use App\Agents\Values\ReadRequest;
use App\Agents\Values\StackTarget;
use App\Bus\Enums\CommandEffectType;
use App\Hooks\Contracts\StackPermission;
use App\Profiles\Values\StartProfileAuthority;

/**
 * Whether the caller's profile may run a read: an explicit denial refuses, then the read's declared entitlement
 * decides. Only a named read the open state asks for, on the exact recovery call, passes without its entitlement.
 */
final readonly class PolicyReadAdmission implements ReadAdmission
{
    public function __construct(
        private CurrentActor $actors,
        private CurrentSession $session,
        private ReadEntitlements $reads,
        private StackPermission $stack,
    ) {}

    public function assess(ReadRequest $request): AccessDecision
    {
        $authority = $this->actors->hasActor() ? $this->actors->authority() : null;

        if (! $authority instanceof StartProfileAuthority) {
            return AccessDecision::allowed(AccessRuleType::ScopeGrant, 'No start profile limits this read.');
        }

        $profile = $authority->profile;

        if ($profile->deniesOperation($request->name)) {
            return AccessDecision::refused(AccessRuleType::ExplicitDenial, "The profile denies {$request->name}.");
        }

        $entitlement = $this->reads->of($request->name);

        return match ($entitlement->type) {
            ReadEntitlementType::Resolver => AccessDecision::allowed(
                AccessRuleType::ScopeGrant,
                "{$request->name} checks every record it shows.",
            ),
            ReadEntitlementType::Grant => $entitlement->isGrantedBy($profile->authorization->grants(...))
                ? AccessDecision::allowed(AccessRuleType::ScopeGrant, 'The profile grants the read.')
                : AccessDecision::refused(AccessRuleType::NotGranted, "The profile does not grant {$request->name}."),
            ReadEntitlementType::Named => $this->named($request, $profile->authorization->holdsRead(
                $request->name,
                $request->target,
            )),
        };
    }

    private function named(ReadRequest $request, bool $held): AccessDecision
    {
        if ($held) {
            return AccessDecision::allowed(AccessRuleType::OperationGrant, "The profile holds {$request->name}.");
        }

        if ($this->session->hasSession()) {
            $target = new StackTarget($this->actors->actor()->id, $this->session->sessionId());
            $recovery = $this->stack->allows($target, CommandEffectType::StateChange)->recovery;

            if ($recovery !== null && $request->matchesRecovery($recovery)) {
                return AccessDecision::allowed(AccessRuleType::OperationGrant, 'The open state asks for this read.');
            }
        }

        return AccessDecision::refused(AccessRuleType::NotGranted, "The profile does not hold {$request->name}.");
    }
}
