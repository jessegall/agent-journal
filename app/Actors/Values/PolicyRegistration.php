<?php

declare(strict_types=1);

namespace App\Actors\Values;

use App\Actors\Contracts\Policy;
use BackedEnum;
use Illuminate\Database\Eloquent\Model;

/**
 * One model with the policy that decides on it and the enum of the abilities that policy grants, with the abilities
 * the journal's built-in agent profiles never get and those only a coordinating profile gets.
 */
final readonly class PolicyRegistration
{
    /**
     * @param  class-string<Model>  $model
     * @param  class-string<Policy>  $policy
     * @param  class-string<BackedEnum>  $abilities
     * @param  list<BackedEnum>  $ownerOnly
     * @param  list<BackedEnum>  $coordinatorOnly
     */
    public function __construct(
        public string $model,
        public string $policy,
        public string $abilities,
        public array $ownerOnly = [],
        public array $coordinatorOnly = [],
    ) {}

    /**
     * The abilities a built-in agent profile gets: every one but the owner's, and the coordinator's only for a
     * coordinating profile.
     *
     * @return list<BackedEnum>
     */
    public function abilitiesForAgents(bool $coordinator): array
    {
        $withheld = $coordinator ? $this->ownerOnly : [...$this->ownerOnly, ...$this->coordinatorOnly];

        $granted = array_filter($this->abilities::cases(), fn (BackedEnum $ability) => ! in_array($ability, $withheld, true));

        return array_values($granted);
    }

    public function grants(BackedEnum $ability): bool
    {
        return $ability instanceof $this->abilities;
    }
}
