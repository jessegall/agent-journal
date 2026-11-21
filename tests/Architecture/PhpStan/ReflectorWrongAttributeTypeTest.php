<?php

declare(strict_types=1);

namespace Tests\Architecture\PhpStan;

use PHPStan\Rules\FunctionCallParametersCheck;
use PHPStan\Rules\Methods\CallMethodsRule;
use PHPStan\Rules\Methods\MethodCallCheck;
use PHPStan\Rules\NonStringableDynamicAccessCheck;
use PHPStan\Rules\Rule;
use PHPStan\Testing\RuleTestCase;

/**
 * An attribute read as one class and handed where another is wanted is reported, so the inferred attribute type is
 * the one checked.
 *
 * @extends RuleTestCase<CallMethodsRule>
 */
final class ReflectorWrongAttributeTypeTest extends RuleTestCase
{
    public function test_an_attribute_of_the_wrong_class_is_reported(): void
    {
        $this->analyse([dirname(__DIR__, 2).'/Fixtures/PhpStan/ReflectorWrongAttributeType.php'], [[
            'Parameter #1 $marker of method Tests\Fixtures\PhpStan\ReflectorWrongAttributeType::labelOf() expects '
                .'Tests\Fixtures\Reflection\Attributes\DerivedMarker, Tests\Fixtures\Reflection\Attributes\Marker given.',
            24,
        ]]);
    }

    protected function getRule(): Rule
    {
        return new CallMethodsRule(
            self::getContainer()->getByType(MethodCallCheck::class),
            self::getContainer()->getByType(FunctionCallParametersCheck::class),
            self::getContainer()->getByType(NonStringableDynamicAccessCheck::class),
        );
    }
}
