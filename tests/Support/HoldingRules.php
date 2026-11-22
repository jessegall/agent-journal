<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Support\ActorContext;
use App\Support\ActorIdentity;
use Domain\Rules\Models\Rule;

/**
 * Rules that already hold, for tests whose subject is something else: each is proposed and approved the way the
 * journal makes one hold, by a user other than its proposer.
 */
final class HoldingRules
{
    public static function create(string $text): Rule
    {
        $rule = Rule::create($text, 'A rule the test needs.', null, ActorContext::forUser(TestIds::of(901)));
        $rule->approveBy(ActorIdentity::of(ActorContext::forUser(TestIds::of(902))));

        return $rule;
    }
}
