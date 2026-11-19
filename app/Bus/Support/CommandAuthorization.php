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
}
