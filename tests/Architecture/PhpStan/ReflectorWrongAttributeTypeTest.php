<?php

declare(strict_types=1);

namespace Tests\Architecture\PhpStan;

use PHPUnit\Framework\TestCase;
use Symfony\Component\Process\Process;
use Tests\Fixtures\PhpStan\ReflectorWrongAttributeType;
use Tests\Fixtures\Reflection\Attributes\DerivedMarker;
use Tests\Fixtures\Reflection\Attributes\Marker;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * An attribute read as one class and handed where another is wanted is reported by PHPStan, so the inferred attribute
 * type is the one checked.
 */
#[TimeLimit(seconds: 120, reason: 'It runs PHPStan on one fixture.')]
final class ReflectorWrongAttributeTypeTest extends TestCase
{
    private const string REPORT = 'Parameter #1 $marker of method %s::labelOf() expects %s, %s given.';

    public function test_an_attribute_of_the_wrong_class_is_reported(): void
    {
        $root = dirname(__DIR__, 3);
        $configuration = "{$root}/storage/framework/cache/reflector-wrong-attribute-type.neon";
        file_put_contents($configuration, <<<NEON
        parameters:
            level: 5
            tmpDir: '{$root}/storage/framework/cache/phpstan-reflector-wrong-attribute-type'
            paths:
                - '{$root}/tests/Fixtures/PhpStan/ReflectorWrongAttributeType.php'

        NEON);

        $analysis = new Process([
            PHP_BINARY,
            'vendor/bin/phpstan',
            'analyse',
            '--configuration='.$configuration,
            '--error-format=json',
            '--no-progress',
            '--memory-limit=1G',
        ], $root, timeout: 110);
        $analysis->run();

        $this->assertStringContainsString(
            sprintf(
                self::REPORT,
                addslashes(ReflectorWrongAttributeType::class),
                addslashes(DerivedMarker::class),
                addslashes(Marker::class),
            ),
            $analysis->getOutput(),
        );
        $this->assertStringContainsString('"line":24', $analysis->getOutput());
    }
}
