<?php

declare(strict_types=1);

namespace App\Attributes\Api;

use Attribute;

/**
 * A call's property that fills the placeholder of the same name in its endpoint's path instead of travelling in the
 * body.
 */
#[Attribute(Attribute::TARGET_PROPERTY)]
final readonly class InPath {}
