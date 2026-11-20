<?php

declare(strict_types=1);

namespace App\Mcp\Attributes;

use App\Mcp\Enums\DiscoveryProfile;
use Attribute;

#[Attribute(Attribute::TARGET_CLASS)]
final readonly class VisibleToProfiles
{
    /** @var list<DiscoveryProfile> */
    public array $profiles;

    public function __construct(DiscoveryProfile ...$profiles)
    {
        $this->profiles = array_values($profiles);
    }
}
