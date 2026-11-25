<?php

declare(strict_types=1);

namespace Tests\Architecture\PhpStan;

use PHPStan\Rules\Rule;
use PHPStan\Testing\RuleTestCase;

/**
 * A reference given to ActorReference::of is reported, whether it is a variable or a command's dispatcher; an actor
 * given to it passes.
 *
 * @extends RuleTestCase<ActorReferenceCopyRule>
 */
final class ActorReferenceCopyRuleTest extends RuleTestCase
{
    private const string COPIED = 'ActorReference::of is given an ActorReference; use the reference as it is.';

    public function test_a_reference_given_to_of_is_reported_and_an_actor_passes(): void
    {
        $this->analyse([dirname(__DIR__, 2).'/Fixtures/PhpStan/ActorReferenceCopies.php'], [
            [
                self::COPIED,
                18,
            ],
            [
                self::COPIED,
                26,
            ],
        ]);
    }

    protected function getRule(): Rule
    {
        return new ActorReferenceCopyRule();
    }
}
