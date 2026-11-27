<?php

declare(strict_types=1);

namespace Tests\Support\Entries\Attributes;

use Attribute;

/**
 * A test class that proves what crosses the wire between the PHP journal, the Go host and the programs it starts,
 * against the host binary and its mocks; it lives in tests/Wire, a suite of its own that composer test:wire runs.
 */
#[Attribute(Attribute::TARGET_CLASS)]
final readonly class OverTheWire {}
