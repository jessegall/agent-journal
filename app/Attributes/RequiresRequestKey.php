<?php

declare(strict_types=1);

namespace App\Attributes;

use Attribute;

/**
 * The command runs only under a request key. Its receipt answers a repeat for retentionDays; after that the key is
 * kept as an expired receipt, refused when used again, until tombstoneDays.
 */
#[Attribute(Attribute::TARGET_CLASS)]
final readonly class RequiresRequestKey
{
    public function __construct(public int $retentionDays, public int $tombstoneDays) {}
}
