<?php

declare(strict_types=1);

namespace Tests\Fixtures\EntryPointTests\Machinery\tests\Machinery;

use PHPUnit\Framework\TestCase;
use Tests\Support\Entries\Attributes\TestsMachinery;

/**
 * A machinery test naming a class that does not exist: the machinery check lists it.
 */
#[TestsMachinery('App\\Support\\NoSuchEngine')]
final class MissingSubjectTest extends TestCase
{
    public function test_it_is_judged_by_what_it_names(): void
    {
        $this->expectNotToPerformAssertions();
    }
}
