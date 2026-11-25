<?php

declare(strict_types=1);

namespace Tests\Support\Entries\Attributes;

use Attribute;

/**
 * A test class that runs its scenario against a stand-in program, such as the stand-in Docker or host.
 */
#[Attribute(Attribute::TARGET_CLASS)]
final readonly class TestsAgainstStandIn {}
