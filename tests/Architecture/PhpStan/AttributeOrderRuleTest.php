<?php

declare(strict_types=1);

namespace Tests\Architecture\PhpStan;

use PHPStan\Rules\Rule;
use PHPStan\Testing\RuleTestCase;

/**
 * A run of attributes with a longer one above a shorter one is caught, on a class, a method and a parameter; a run
 * shortest first is not.
 *
 * @extends RuleTestCase<AttributeOrderRule>
 */
final class AttributeOrderRuleTest extends RuleTestCase
{
    public function test_a_run_of_attributes_with_a_longer_one_on_top_is_caught(): void
    {
        $message = 'Order the attributes shortest first: run tools/refactoring/sort-attributes.php on the file.';
        $fixture = dirname(__DIR__, 2).'/Fixtures/PhpStan/AttributeOrders.php';

        $this->analyse([$fixture], [[$message, 10], [$message, 18], [$message, 23]]);
    }

    protected function getRule(): Rule
    {
        return new AttributeOrderRule();
    }
}
