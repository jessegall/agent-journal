<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Actors\Contracts\Policy;
use BackedEnum;

/**
 * The policy and ability a command declared, validated at boot against its subject and its handler.
 */
final readonly class CommandAuthorization
{
    /**
     * @param  class-string<Policy>  $policy
     */
    public function __construct(public string $policy, public BackedEnum $ability) {}

    /**
     * The policy and ability as an audit line's fields.
     *
     * @return array{policy: class-string<Policy>, ability: string|int}
     */
    public function auditFields(): array
    {
        return ['policy' => $this->policy, 'ability' => $this->ability->value];
    }
}
