<?php

declare(strict_types=1);

namespace Tests\Fixtures\EntryPointTests\Kinds\tests\Unit;

use PHPUnit\Framework\TestCase;

/**
 * A unit test, of its folder's kind: the kind check passes it.
 */
final class PlainTest extends TestCase
{
    public function test_its_folder_gives_its_kind(): void
    {
        $this->expectNotToPerformAssertions();
    }
}
