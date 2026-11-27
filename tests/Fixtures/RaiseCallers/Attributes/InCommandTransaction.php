<?php

declare(strict_types=1);

namespace Tests\Fixtures\RaiseCallers\Attributes;

use Attribute;

/**
 * The fixtures' copy of the attribute that marks a listener required in the command's transaction.
 */
#[Attribute(Attribute::TARGET_CLASS)]
final readonly class InCommandTransaction {}
