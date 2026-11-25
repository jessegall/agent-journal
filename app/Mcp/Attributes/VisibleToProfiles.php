<?php

declare(strict_types=1);

namespace App\Mcp\Attributes;

use App\Mcp\Enums\DiscoveryProfile;
use Attribute;

#[Attribute(Attribute::TARGET_CLASS)]
final readonly class VisibleToProfiles
{
    /**
     * @var list<DiscoveryProfile>
     */
    public array $profiles;

    /**
     * At least one profile: a tool no profile sees could never be called, since every caller is a start of one.
     */
    public function __construct(DiscoveryProfile $profile, DiscoveryProfile ...$more)
    {
        $this->profiles = [
            $profile,
            ...array_values($more),
        ];
    }
}
