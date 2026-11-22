<?php

declare(strict_types=1);

namespace Tests\Unit\Files;

use App\Exceptions\DepthTooDeep;
use App\Values\Depth;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

/**
 * A list or walk descends one level by default and at most sixteen; any other depth is refused before a read.
 */
final class DepthTest extends TestCase
{
    public function test_one_level_is_the_default_and_the_limit_itself_may_be_asked(): void
    {
        $this->assertSame(1, Depth::one()->levels);
        $this->assertEquals(Depth::one(), new Depth(1));
        $this->assertSame(16, Depth::levels(16)->levels);
    }

    /**
     * @return iterable<string, array{int}>
     */
    public static function refusedLevels(): iterable
    {
        yield 'no level' => [0];

        yield 'one past the limit' => [17];
    }

    #[DataProvider('refusedLevels')]
    public function test_a_depth_of_no_level_or_past_the_limit_is_refused_by_name(int $levels): void
    {
        $this->expectExceptionObject(DepthTooDeep::asked($levels, Depth::LEVEL_LIMIT));

        Depth::levels($levels);
    }
}
