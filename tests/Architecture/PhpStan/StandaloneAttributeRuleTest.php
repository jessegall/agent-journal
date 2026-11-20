<?php

declare(strict_types=1);

namespace Tests\Architecture\PhpStan;

use PHPStan\Rules\Rule;
use PHPStan\Testing\RuleTestCase;

/**
 * An attribute in front of a property or a promoted parameter on its own line is caught; one on the line above, and
 * one on a plain parameter, are not.
 *
 * @extends RuleTestCase<StandaloneAttributeRule>
 */
final class StandaloneAttributeRuleTest extends RuleTestCase
{
    public function test_an_attribute_in_front_of_a_property_or_promoted_parameter_is_caught(): void
    {
        $message = 'Put the attribute on its own line above the property it marks.';
        $fixture = dirname(__DIR__, 2).'/Fixtures/PhpStan/AttributePlacements.php';

        $this->analyse([$fixture], [[$message, 14], [$message, 20]]);
    }

    protected function getRule(): Rule
    {
        return new StandaloneAttributeRule();
    }
}
