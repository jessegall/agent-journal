<?php

declare(strict_types=1);

namespace Tests\Architecture\PhpStan;

use PHPStan\Testing\TypeInferenceTestCase;
use PHPUnit\Framework\Attributes\DataProvider;

/**
 * PHPStan infers the reflection wrapper's types: Reflector<static> for reflect() with no target, Reflector<U> for a
 * class-string or an object, the attribute class itself for attribute(), and Option of it for attributes()->first().
 */
final class ReflectorTypesTest extends TypeInferenceTestCase
{
    /**
     * @return iterable<mixed>
     */
    public static function inferredTypes(): iterable
    {
        yield from self::gatherAssertTypes(dirname(__DIR__, 2).'/Fixtures/PhpStan/ReflectorTypes.php');
    }

    #[DataProvider('inferredTypes')]
    public function test_the_wrapper_reads_infer_their_types(string $assertType, string $file, mixed ...$args): void
    {
        $this->assertFileAsserts($assertType, $file, ...$args);
    }
}
