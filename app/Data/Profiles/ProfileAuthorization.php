<?php

declare(strict_types=1);

namespace App\Data\Profiles;

use App\Attributes\Authorize;
use App\Contracts\Authorization\Policy;
use App\Contracts\Authorization\PolicyCatalogue;
use App\Contracts\Bus\Command;
use App\Enums\AccessRuleType;
use App\Enums\AccessType;
use App\Enums\AuthorizationType;
use App\Exceptions\ActorNotAllowed;
use App\Exceptions\GrantNotRegistered;
use App\Exceptions\GrantNotWithheld;
use App\Values\AccessDecision;
use App\Values\AgentText;
use App\Values\AllowedNames;
use App\Values\WithheldGrant;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * A profile's authorization: its strategy, the policy accesses it grants and the commands it denies outright. A pair
 * its grants do not name is never granted, an undeclared one included.
 */
final class ProfileAuthorization extends Data
{
    /**
     * @param  list<PolicyGrant>  $grants
     * @param  list<class-string<Command<mixed>>>  $deniedCommands
     * @param  list<ScopedRead>  $reads  the named reads the profile holds, each for one target or every target
     */
    public function __construct(
        public readonly AuthorizationType $type,
        #[DataCollectionOf(PolicyGrant::class)]
        public readonly array $grants,
        public readonly array $deniedCommands = [],
        #[DataCollectionOf(ScopedRead::class)]
        public readonly array $reads = [],
    ) {}

    /**
     * These grants less every withheld one; withholding a pair this profile does not grant is refused, so a misspelt
     * one never passes as a narrowing. The base stays as it was.
     *
     * @param  list<WithheldGrant>  $withheld
     *
     * @throws GrantNotWithheld
     */
    public function without(array $withheld): self
    {
        foreach ($withheld as $grant) {
            if (! array_any($this->grants, fn (PolicyGrant $held) => $grant->withholds($held))) {
                throw GrantNotWithheld::for($grant->policy, $grant->access);
            }
        }

        $kept = array_filter(
            $this->grants,
            fn (PolicyGrant $held) => ! array_any($withheld, fn (WithheldGrant $grant) => $grant->withholds($held)),
        );

        return new self($this->type, array_values($kept), $this->deniedCommands, $this->reads);
    }

    /**
     * These grants with more commands denied outright.
     *
     * @param  list<class-string<Command<mixed>>>  $commands
     */
    public function denying(array $commands): self
    {
        $denied = array_values(array_unique([
            ...$this->deniedCommands,
            ...$commands,
        ]));

        return clone ($this, ['deniedCommands' => $denied]);
    }

    /**
     * Whether an application command may run under this profile: a denied command never does, a held pair does.
     *
     * @param  class-string<Command<mixed>>  $command
     */
    public function admits(string $command, Authorize $authorization): AccessDecision
    {
        if (in_array($command, $this->deniedCommands, true)) {
            return AccessDecision::refused(
                AccessRuleType::ExplicitDenial,
                AgentText::of('core.access.profile_denies', ['name' => $command]),
            );
        }

        if ($this->grants($authorization->policy, $authorization->access)) {
            return AccessDecision::allowed(AccessRuleType::ScopeGrant, AgentText::of('core.access.profile_grants_pair'));
        }

        return AccessDecision::refused(
            AccessRuleType::NotGranted,
            AgentText::of('core.access.profile_does_not_grant_pair'),
        );
    }

    /**
     * Whether the profile holds the named read for this target; an unrestricted profile holds every read.
     */
    public function holdsRead(string $name, string|null $target): bool
    {
        return $this->type === AuthorizationType::AllowsEverything
            || array_any($this->reads, fn (ScopedRead $read) => $read->covers($name, $target));
    }

    /**
     * The targets the profile holds the named read for: every target when it holds the read unscoped or allows
     * everything, else only the targets its scoped reads name, which may be none.
     */
    public function readTargets(string $name): AllowedNames
    {
        if ($this->holdsRead($name, null)) {
            return AllowedNames::all();
        }

        $targets = [];

        foreach ($this->reads as $read) {
            if ($read->name === $name && $read->target !== null) {
                $targets[] = $read->target;
            }
        }

        return AllowedNames::only($targets);
    }

    /**
     * @param  class-string<Policy>  $policy
     *
     * @throws ActorNotAllowed
     */
    public function assertGranted(string $policy, AccessType $access): void
    {
        if (! $this->grants($policy, $access)) {
            throw ActorNotAllowed::to($access, 'record');
        }
    }

    /**
     * Refuses a grant no available policy accepts.
     *
     * @throws GrantNotRegistered
     */
    public function assertGrantableIn(PolicyCatalogue $catalogue): void
    {
        foreach ($this->grants as $grant) {
            $catalogue->assertGrantable($grant->policy, $grant->access);
        }
    }

    /**
     * Whether this profile holds the pair: the one membership test every check of a grant uses.
     *
     * @param  class-string<Policy>  $policy
     */
    public function grants(string $policy, AccessType $access): bool
    {
        return $this->type->grants($this->grants, $policy, $access);
    }

    /**
     * Whether the other authorization grants nothing this one does not: a restricted profile never contains an
     * unrestricted one, every pair and named read the other holds is held here for the same or a wider target, and
     * the other keeps every command this one denies. Its admitted commands follow from that over one registry.
     */
    public function contains(self $other): bool
    {
        if ($this->type === AuthorizationType::AllowsEverything) {
            return true;
        }

        return $other->type === AuthorizationType::Policies
            && array_all($other->grants, fn (PolicyGrant $grant) => $this->grants($grant->policy, $grant->access))
            && array_all($other->reads, fn (ScopedRead $read) => $this->holdsRead($read->name, $read->target)
                && ($read->target !== null || array_any(
                    $this->reads,
                    fn (ScopedRead $held) => $held->name === $read->name && $held->target === null,
                )))
            && array_all(
                $this->deniedCommands,
                fn (string $command) => in_array($command, $other->deniedCommands, true),
            );
    }
}
