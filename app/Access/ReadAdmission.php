<?php

declare(strict_types=1);

namespace App\Access;

use App\Access\Contracts\ReadAdmission as ReadAdmissionContract;
use App\Access\Contracts\ReadEntitlements;
use App\Actors\Contracts\CurrentActor;
use App\Profiles\Data\ProfileAuthorization;
use App\Profiles\Enums\AccessRuleType;
use App\Profiles\Enums\ReadEntitlementType;
use App\Values\AccessDecision;
use App\Values\AgentText;
use App\Values\AllowedNames;
use App\Values\ProfileSnapshot;
use App\Values\ReadRequest;
use App\Values\StartProfileAuthority;

/**
 * Whether the caller's profile may run a read: an explicit denial refuses, then the read's declared entitlement
 * decides. Only a named read the open state asks for, on the exact recovery call, passes without its entitlement.
 */
final readonly class ReadAdmission implements ReadAdmissionContract
{
    public function __construct(
        private CurrentActor $actors,
        private ReadEntitlements $reads,
    ) {}

    public function assess(ReadRequest $request): AccessDecision
    {
        return $this->actors->startProfileAuthority()->map(
            fn (StartProfileAuthority $authority) => $this->assessForProfile($request, $authority->profile),
        )->getOrCall(fn () => AccessDecision::allowed(
            AccessRuleType::ScopeGrant,
            AgentText::of('core.access.no_profile_limits_read'),
        ));
    }

    private function assessForProfile(ReadRequest $request, ProfileSnapshot $profile): AccessDecision
    {

        if ($profile->deniesOperation($request->name)) {
            return AccessDecision::refused(
                AccessRuleType::ExplicitDenial,
                AgentText::of('core.access.profile_denies', ['name' => $request->name]),
            );
        }

        $entitlement = $this->reads->of($request->name);

        return match ($entitlement->type) {
            ReadEntitlementType::Resolver => AccessDecision::allowed(
                AccessRuleType::ScopeGrant,
                AgentText::of('core.access.resolver_checks_records', ['name' => $request->name]),
            ),
            ReadEntitlementType::Grant => $entitlement->isGrantedBy($profile->authorization->grants(...))
                ? AccessDecision::allowed(AccessRuleType::ScopeGrant, AgentText::of('core.access.profile_grants_read'))
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
        return $this->actors->startProfileAuthority()->map(
            fn (StartProfileAuthority $authority) => $this->allowedTargetsForProfile($name, $authority->profile),
        )->getOrCall(fn () => AllowedNames::all());
    }

    private function allowedTargetsForProfile(string $name, ProfileSnapshot $profile): AllowedNames
    {

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
     * discovery runs while the profile holds it for any target, so a grant for task A needs no placeholder id.
     */
    private function scoped(ReadRequest $request, ProfileAuthorization $authorization): AccessDecision
    {
        if (self::holds($authorization->readTargets($request->name), $request)) {
            return AccessDecision::allowed(
                AccessRuleType::OperationGrant,
                AgentText::of('core.access.profile_holds_for_it', ['name' => $request->name]),
            );
        }

        return AccessDecision::refused(
            AccessRuleType::NotGranted,
            AgentText::of('core.access.profile_does_not_grant', ['name' => $request->name]),
        );
    }

    private static function holds(AllowedNames $targets, ReadRequest $request): bool
    {
        if ($request->isDiscovery) {
            return ! $targets->hasNoneAllowed();
        }

        if ($request->target === null) {
            return ! $targets->isRestricted();
        }

        return $targets->admits($request->target);
    }

    private function named(ReadRequest $request, bool $isHeld): AccessDecision
    {
        if ($isHeld) {
            return AccessDecision::allowed(
                AccessRuleType::OperationGrant,
                AgentText::of('core.access.profile_holds', ['name' => $request->name]),
            );
        }

        return AccessDecision::refused(
            AccessRuleType::NotGranted,
            AgentText::of('core.access.profile_does_not_hold', ['name' => $request->name]),
        );
    }
}
