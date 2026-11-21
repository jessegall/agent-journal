<?php

declare(strict_types=1);

namespace App\Contracts\Attributes;

use Attribute;

/**
 * Marks a listener whose writes the command's transaction requires: the bus runs it inside the unit, before the
 * commit, and never through Laravel's dispatcher.
 */
#[Attribute(Attribute::TARGET_CLASS)]
final readonly class InCommandTransaction {}
