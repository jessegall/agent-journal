<?php

declare(strict_types=1);

namespace Tests\Architecture;

use PHPUnit\Framework\TestCase;
use Tests\Architecture\Support\ParsedFile;
use Tests\Architecture\Support\StaticFactoryScan;

/**
 * The scan finds a static factory called again with the same arguments in one function body and a static Reflector
 * call in an instance method of a class the container builds, and leaves alone other arguments, calls without
 * arguments, calls in a nested closure, a static helper and a value object whose constructor hides no service.
 */
final class StaticFactoryScanTest extends TestCase
{
    public function test_each_planted_shape_is_found_and_each_look_alike_left_alone(): void
    {
        $findings = new StaticFactoryScan()->findingsIn(
            ParsedFile::fromPath(dirname(__DIR__).'/Fixtures/StaticFactories/StaticFactoryUses.php'),
        );

        $this->assertSame(
            [
                [22, 'App\Support\Reflector::of', StaticFactoryScan::INJECTABLE],
                [24, 'App\Support\Reflector::of', StaticFactoryScan::INJECTABLE],
                [24, 'App\Support\Reflector::of($this->name)', StaticFactoryScan::REPEATED],
            ],
            array_map(fn (array $finding) => [$finding['line'], $finding['call'], $finding['reason']], $findings),
        );
    }
}
