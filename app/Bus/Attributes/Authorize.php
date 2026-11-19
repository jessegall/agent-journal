<?php

declare(strict_types=1);

namespace App\Bus\Attributes;

use App\Actors\Contracts\Policy;
use Attribute;
use BackedEnum;

/**
 * The policy and ability a command is authorized by; the command names its subject through HasAuthorizationSubject.
 */
#[Attribute(Attribute::TARGET_CLASS)]
final readonly class Authorize
{
    /**
     * @param  class-string<Policy>  $policy
     */
    public function __construct(public string $policy, public BackedEnum $ability) {}
}
