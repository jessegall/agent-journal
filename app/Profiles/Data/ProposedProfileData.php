<?php

declare(strict_types=1);

namespace App\Profiles\Data;

use App\Profiles\Enums\InstancePolicy;
use App\Profiles\Exceptions\ProfileProposalRefused;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * The fields of one proposed profile as the proposal writes them, besides its policy override; a label left out is
 * the profile's key.
 */
#[MapName(SnakeCaseMapper::class)]
final class ProposedProfileData extends Data
{
    /**
     * @param  list<string>  $allowedModels
     * @param  list<string>|null  $skillAllowlist  null when the proposal leaves it out
     * @param  list<string>  $requiredSkills
     * @param  list<ProposedStopConditionData>  $stopConditions
     * @param  list<WithheldAbilityData>  $withheldAbilities  abilities of its base this profile does not grant
     */
    public function __construct(
        public readonly string $base,
        public readonly string $model,
        public readonly string|null $label = null,
        public readonly string $instructions = '',
        public readonly string|null $program = null,
        public readonly bool $programPinned = false,
        public readonly array $allowedModels = [],
        public readonly array|null $skillAllowlist = null,
        public readonly array $requiredSkills = [],
        public readonly string|null $container = null,
        #[DataCollectionOf(ProposedStopConditionData::class)]
        public readonly array $stopConditions = [],
        #[DataCollectionOf(WithheldAbilityData::class)]
        public readonly array $withheldAbilities = [],
        public readonly string $instances = 'reusable',
    ) {}

    /**
     * How many helpers the profile may have; a value it does not know refuses the proposal.
     *
     * @throws ProfileProposalRefused
     */
    public function instancePolicy(string $key): InstancePolicy
    {
        $policy = InstancePolicy::tryFrom($this->instances);

        return $policy ?? throw ProfileProposalRefused::unknownInstances($key, $this->instances);
    }
}
