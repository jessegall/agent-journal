<?php

declare(strict_types=1);

namespace Tests\Fixtures\EntryPointTests\Machinery\tests\Machinery;

use PHPUnit\Framework\TestCase;

/**
 * A machinery test that names no engine class: the machinery check lists it.
 */
final class UnnamedTest extends TestCase
{
    public function test_it_is_judged_by_what_it_names(): void
    {
        $this->assertTrue(true);
    }
}
