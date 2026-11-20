<?php

declare(strict_types=1);

namespace Tests\Fixtures\TypeNames;

use Attribute;

/**
 * An attribute reads as a declaration on what it marks, so its verb name passes.
 */
#[Attribute(Attribute::TARGET_CLASS)]
final readonly class RequiresLap {}
