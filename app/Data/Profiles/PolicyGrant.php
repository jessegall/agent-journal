<?php

declare(strict_types=1);

namespace App\Data\Profiles;

use App\Contracts\Authorization\Policy;
use App\Enums\Agents\AccessType;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * One access a profile grants on one policy. The pair is the identity, and a stored grant is exactly its two keys.
 */
#[MapName(SnakeCaseMapper::class)]
final class PolicyGrant extends Data
{
    /**
     * @param  class-string<Policy>  $policy
     */
    public function __construct(public readonly string $policy, public readonly AccessType $access) {}

    /**
     * @param  class-string<Policy>  $policy
     */
    public function isFor(string $policy, AccessType $access): bool
    {
        return $this->policy === $policy && $this->access === $access;
    }
}
