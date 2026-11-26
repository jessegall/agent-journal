<?php

declare(strict_types=1);

namespace Tests\Fixtures\EntryPointTests\Kinds\tests\StandIn;

use PHPUnit\Framework\TestCase;
use Tests\Support\Entries\Attributes\TestsAgainstStandIn;

/**
 * A stand-in test, of its attribute's kind: the kind check passes it.
 */
#[TestsAgainstStandIn]
final class ScriptTest extends TestCase
{
    public function test_its_attribute_gives_its_kind(): void
    {
        $this->expectNotToPerformAssertions();
    }
}
