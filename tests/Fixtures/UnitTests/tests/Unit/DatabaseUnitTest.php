<?php

declare(strict_types=1);

namespace Tests\Fixtures\UnitTests\tests\Unit;

use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A unit test that asks for the database: the unit test check lists it.
 */
final class DatabaseUnitTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_it_should_have_been_an_entry_test(): void
    {
        $this->assertTrue(true);
    }
}
