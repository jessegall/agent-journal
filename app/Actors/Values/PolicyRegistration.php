<?php

declare(strict_types=1);

namespace App\Actors\Values;

use App\Actors\Contracts\Policy;
use BackedEnum;
use Illuminate\Database\Eloquent\Model;

/**
 * One model with the policy that decides on it and the enum of the abilities that policy grants.
 */
final readonly class PolicyRegistration
{
    /**
     * @param  class-string<Model>  $model
     * @param  class-string<Policy>  $policy
     * @param  class-string<BackedEnum>  $abilities
     */
    public function __construct(public string $model, public string $policy, public string $abilities) {}

    /**
     * @return list<BackedEnum>
     */
    public function abilities(): array
    {
        return $this->abilities::cases();
    }

    public function grants(BackedEnum $ability): bool
    {
        return $ability instanceof $this->abilities;
    }
}
