<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Admission\ReadAdmission;
use App\Contracts\Authorization\ReadEntitlements;
use App\Contracts\Sessions\CurrentSession;
use App\Enums\AccessRuleType;
use App\Enums\CommandEffectType;
use App\Enums\ReadEntitlementType;
use App\Support\Stack\Contracts\StackPermission;
use App\Values\AccessDecision;
use App\Values\AllowedNames;
use App\Values\ProfileAuthorization;
use App\Values\ReadRequest;
use App\Values\StackTarget;
use App\Values\StartProfileAuthority;

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
                : $this->scoped($request, $profile->authorization),
            ReadEntitlementType::Named => $this->named($request, $profile->authorization->holdsRead(
                $request->name,
                $request->target,
            )),
        };
    }

    /**
     * The targets the caller may run the named read for: every one without a start profile, through a read that
     * checks each record itself or through the policy grant; else those the profile's scoped reads name.
     */
    public function allowedTargets(string $name): AllowedNames
    {
        $authority = $this->actors->hasActor() ? $this->actors->authority() : null;

        if (! $authority instanceof StartProfileAuthority) {
            return AllowedNames::all();
        }

        $profile = $authority->profile;

        if ($profile->deniesOperation($name)) {
            return AllowedNames::only([]);
        }

        $entitlement = $this->reads->of($name);

        return match ($entitlement->type) {
            ReadEntitlementType::Resolver => AllowedNames::all(),
            ReadEntitlementType::Grant => $entitlement->isGrantedBy($profile->authorization->grants(...))
                ? AllowedNames::all()
                : $profile->authorization->readTargets($name),
            ReadEntitlementType::Named => $profile->authorization->readTargets($name),
        };
    }

    /**
     * A granted read the policy grant does not cover still runs for a target the profile holds it for, and its
     * discovery runs while the profile holds it for any target, so a grant for task A needs no dummy id.
     */
    private function scoped(ReadRequest $request, ProfileAuthorization $authorization): AccessDecision
    {
        return self::holds($authorization->readTargets($request->name), $request)
            ? AccessDecision::allowed(AccessRuleType::OperationGrant, "The profile holds {$request->name} for it.")
            : AccessDecision::refused(AccessRuleType::NotGranted, "The profile does not grant {$request->name}.");
    }

    private static function holds(AllowedNames $targets, ReadRequest $request): bool
    {
        if ($request->discovery) {
            return ! $targets->hasNoneAllowed();
        }

        if ($request->target === null) {
            return ! $targets->isRestricted();
        }

        return $targets->admits($request->target);
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
