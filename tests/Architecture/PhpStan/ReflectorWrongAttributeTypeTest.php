<?php

declare(strict_types=1);

namespace Tests\Architecture\PhpStan;

use PHPUnit\Framework\TestCase;
use Symfony\Component\Process\Process;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * An attribute read as one class and handed where another is wanted is reported by PHPStan, so the inferred attribute
 * type is the one checked.
 */
#[TimeLimit(seconds: 120, reason: 'It runs PHPStan on one fixture.')]
final class ReflectorWrongAttributeTypeTest extends TestCase
{
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
            'Parameter #1 $marker of method Tests\\\\Fixtures\\\\PhpStan\\\\ReflectorWrongAttributeType::labelOf() expects '
                .'Tests\\\\Fixtures\\\\Reflection\\\\Attributes\\\\DerivedMarker, '
                .'Tests\\\\Fixtures\\\\Reflection\\\\Attributes\\\\Marker given.',
            $analysis->getOutput(),
        );
        $this->assertStringContainsString('"line":24', $analysis->getOutput());
    }
}
