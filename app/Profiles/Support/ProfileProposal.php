<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Agents\Enums\ExecutionModeType;
use App\Profiles\Data\PolicyOverrideData;
use App\Profiles\Data\ProfileConfigurationData;
use App\Profiles\Data\ProposedProfileData;
use App\Profiles\Data\ProposedStopConditionData;
use App\Profiles\Data\WithheldGrantData;
use App\Profiles\Exceptions\ProfileProposalRefused;
use App\Profiles\Exceptions\SupervisorRouteInvalid;
use App\Profiles\Values\ProfileBase;
use App\Profiles\Values\ProfileKey;
use App\Profiles\Values\SupervisorRoutes;
use Spatie\LaravelData\Exceptions\CannotCastEnum;
use Spatie\LaravelData\Exceptions\CannotCreateData;
use TypeError;
use ValueError;

/**
 * The validated, typed form of a proposed profile configuration such as config/profiles.php: its revision, the
 * project's overrides per built-in base, and each profile. A proposal is not live authority until an owner activates
 * it. No
 * untyped value passes beyond this class.
 */
final readonly class ProfileProposal
{
    /**
     * Feature fields of later work; a proposal naming one is refused as unsupported.
     */
    private const array UNSUPPORTED_FIELDS = ['script', 'commands'];

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
        return new self($this->revision, $this->baseOverrides, [...BuiltInProfiles::proposed(), ...$this->profiles]);
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

        return new ProposedProfile(
            ProfileKey::from($key),
            $fields->label ?? $key,
            ProfileBase::of($fields->base),
            $fields->instructions,
            $fields->model,
            $fields->driver === null ? null : $fields->driver,
            $fields->driverPinned,
            $fields->allowedModels,
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

        return SupervisorRoutes::fromArray($profile['supervisor']);
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
