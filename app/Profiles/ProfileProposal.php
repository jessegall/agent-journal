<?php

declare(strict_types=1);

namespace App\Profiles;

use App\Agents\Enums\ExecutionModeType;
use App\Exceptions\SupervisorRouteInvalid;
use App\Profiles\Data\PolicyOverrideData;
use App\Profiles\Data\ProfileConfigurationData;
use App\Profiles\Data\ProposedProfileData;
use App\Profiles\Data\ProposedStopConditionData;
use App\Profiles\Data\WithheldGrantData;
use App\Profiles\Enums\ModelTier;
use App\Profiles\Exceptions\ProfileProposalRefused;
use App\Values\ProfileBase;
use App\Values\ProfileKey;
use App\Values\SupervisorRoutes;
use Spatie\LaravelData\Exceptions\CannotCastEnum;
use Spatie\LaravelData\Exceptions\CannotCreateData;
use TypeError;
use ValueError;

/**
 * The validated, typed form of a proposed profile configuration such as config/journal.php (profiles): its revision, the
 * project's overrides per built-in base, and each profile. It is not live authority until an owner activates it, and no
 * untyped value passes beyond it.
 */
final readonly class ProfileProposal
{
    /**
     * Feature fields of later work; a proposal naming one is refused as unsupported.
     */
    private const array UNSUPPORTED_FIELDS = [
        'script',
        'commands',
    ];

    /**
     * @param  list<BaseOverride>  $baseOverrides
     * @param  list<ProposedProfile>  $profiles
     */
    public function __construct(
        public int $revision,
        public array $baseOverrides,
        public array $profiles,
    ) {}

    /**
     * Reads a proposal in its serialized shape, refusing any field it does not know or support.
     *
     * @param  array<string, mixed>  $configuration
     *
     * @throws ProfileProposalRefused
     */
    public static function fromConfiguration(array $configuration): self
    {
        try {
            $written = ProfileConfigurationData::from($configuration);

            $profiles = array_map(
                fn (string $key) => self::profile($key, $written->profiles[$key]),
                array_map(strval(...), array_keys($written->profiles)),
            );

            return new self($written->revision, $written->toBaseOverrides(), $profiles);
        } catch (TypeError|ValueError|CannotCreateData|CannotCastEnum $failure) {
            throw ProfileProposalRefused::unreadable($failure);
        }
    }

    /**
     * The proposal with the journal's built-in profiles added; a project profile of the same key is refused as
     * repeated when it is activated.
     */
    public function withBuiltIns(): self
    {
        return clone ($this, ['profiles' => [...BuiltInProfiles::proposed(), ...$this->profiles]]);
    }

    /**
     * The project's override of the base; none when the proposal gives none.
     */
    public function overrideFor(ProfileBase $base): PolicyOverride
    {
        foreach ($this->baseOverrides as $override) {
            if ($override->base->is($base)) {
                return $override->override;
            }
        }

        return PolicyOverride::none();
    }

    /**
     * The tier a profile names, or its base type's when it names none; a number that is no tier refuses the proposal.
     *
     * @throws ProfileProposalRefused
     */
    private static function tier(string $key, int|null $tier, ProfileBase $base): ModelTier
    {
        if ($tier === null) {
            return $base->tier;
        }

        return ModelTier::tryFrom($tier) ?? throw ProfileProposalRefused::unknownTier($key, $tier);
    }

    /**
     * @param  array<string, mixed>  $profile
     *
     * @throws ProfileProposalRefused
     */
    private static function profile(string $key, array $profile): ProposedProfile
    {
        foreach (self::UNSUPPORTED_FIELDS as $field) {
            if (array_key_exists($field, $profile)) {
                throw ProfileProposalRefused::unsupportedField($key, $field);
            }
        }

        $fields = ProposedProfileData::from($profile);
        $base = ProfileBase::of($fields->base);

        return new ProposedProfile(
            ProfileKey::from($key),
            $fields->label ?? $key,
            $base,
            $fields->instructions,
            self::tier($key, $fields->tier, $base),
            $fields->preferredDriver,
            $fields->skillAllowlist,
            $fields->requiredSkills,
            $fields->container === null ? null : self::executionMode($fields->container),
            PolicyOverrideData::from($profile)->toPolicyOverride(),
            array_map(
                fn (ProposedStopConditionData $condition) => $condition->toStopCondition(),
                $fields->stopConditions,
            ),
            array_map(
                fn (WithheldGrantData $withheld) => $withheld->toWithheldGrant(),
                $fields->withheldGrants,
            ),
            $fields->deniedCommands,
            self::supervisors($profile),
            $fields->instancePolicy($key),
            $fields->description,
        );
    }

    /**
     * @param  array<string, mixed>  $profile
     */
    private static function supervisors(array $profile): SupervisorRoutes
    {
        if (! array_key_exists('supervisor', $profile)) {
            return new SupervisorRoutes();
        }

        if (! is_array($profile['supervisor'])) {
            throw SupervisorRouteInvalid::missingDefault();
        }

        return SupervisorRoutes::parse($profile['supervisor']);
    }

    /**
     * Where a proposal asks a profile to run: required means a required container, host the protected host.
     *
     * @throws ValueError
     */
    private static function executionMode(string $container): ExecutionModeType
    {
        return match ($container) {
            'required' => ExecutionModeType::RequiredContainer,
            'host' => ExecutionModeType::ProtectedHost,
            default => ExecutionModeType::from($container),
        };
    }
}
