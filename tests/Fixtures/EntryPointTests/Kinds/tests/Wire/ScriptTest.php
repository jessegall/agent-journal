<?php

declare(strict_types=1);

namespace Tests\Fixtures\EntryPointTests\Kinds\tests\Wire;

use PHPUnit\Framework\TestCase;
use Tests\Support\Entries\Attributes\OverTheWire;

/**
 * A test over the wire, of its attribute's kind: the kind check passes it.
 */
#[OverTheWire]
final class ScriptTest extends TestCase
{
    public function test_its_attribute_gives_its_kind(): void
    {
        $this->expectNotToPerformAssertions();
    }
}
