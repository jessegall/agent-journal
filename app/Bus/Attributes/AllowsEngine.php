<?php

declare(strict_types=1);

namespace App\Bus\Attributes;

use Attribute;

/**
 * The engine may run this command; its handler still authorizes the one target or maintenance scope it was granted.
 */
#[Attribute(Attribute::TARGET_CLASS)]
final readonly class AllowsEngine {}
