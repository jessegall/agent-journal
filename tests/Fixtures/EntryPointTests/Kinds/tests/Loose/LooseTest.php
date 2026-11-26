<?php

declare(strict_types=1);

namespace Tests\Fixtures\EntryPointTests\Kinds\tests\Loose;

use PHPUnit\Framework\TestCase;

/**
 * A test outside every kind's folder that names no entry: the kind check lists it.
 */
final class LooseTest extends TestCase
{
    public function test_nothing_it_proves_has_a_kind(): void
    {
        $this->assertTrue(true);
    }
}
