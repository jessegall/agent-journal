<?php

declare(strict_types=1);

namespace Tests\Unit\Processes;

use App\CommandRules\Values\RuleReference;
use App\CommandRules\Values\RuleScope;
use App\Support\Rules\CoreRules;
use App\Values\CommandRule;
use Tests\TestCase;

/**
 * The JSON a rule is stored as is pinned by the digests approvals and the frozen corpus classifications bind: a check
 * rule with its contract, and a project rule that replaces it, keep their digests and read back to the same rule,
 * also through the fromJson and listFromJson their casts read with.
 */
final class StoredRuleShapeTest extends TestCase
{
    private const string REPLACED_LABEL = 'core core.php.artisan-test@1';

    private const string CHECK_RULE = 'core.php.artisan-test';

    private const string RULE_DIGEST = '627b545e94cfaa9c371d43ddcffa01846243c4a6e1a8167807b94d5fae4a13e5';

    private const string CONTRACT_DIGEST = 'f1fe2a9b4ccef52df1ba969be6c3cc506fb8400fcc4cf9a962622c9a48e47cce';

    private const string REPLACING_DIGEST = '79ee205952956ad6ce52252d98264e8ce119a71a84350bbaec53685312351e84';

    public function test_a_check_rule_and_its_contract_keep_their_stored_digests(): void
    {
        $rule = $this->checkRule();

        $this->assertSame(self::RULE_DIGEST, $rule->digest());
        $this->assertSame(self::CONTRACT_DIGEST, $rule->contracts[0]->digest());
        $this->assertSame(self::RULE_DIGEST, $this->readBack($rule)->digest());
    }

    public function test_a_project_rule_replacing_a_core_rule_keeps_its_stored_digest(): void
    {
        $core = $this->checkRule();
        $replacing = $core->ownedBy(RuleScope::project(), 2)
            ->replacing(new RuleReference($core->scope, $core->id, $core->revision));

        $this->assertSame(self::REPLACING_DIGEST, $replacing->digest());
        $this->assertSame(self::REPLACING_DIGEST, $this->readBack($replacing)->digest());
        $this->assertSame(self::REPLACED_LABEL, $this->readBack($replacing)->replaces[0]->label());
    }

    public function test_a_stored_rule_reads_back_through_its_cast_to_the_same_json_and_digest(): void
    {
        $core = $this->checkRule();
        $replacing = $core->ownedBy(RuleScope::project(), 2)
            ->replacing(new RuleReference($core->scope, $core->id, $core->revision));
        $stored = json_encode($core->toArray(), JSON_THROW_ON_ERROR);
        $storedList = json_encode([$core->toArray(), $replacing->toArray()], JSON_THROW_ON_ERROR);
        $read = CommandRule::from(json_decode($stored, true, flags: JSON_THROW_ON_ERROR));
        $readList = CommandRule::collect(json_decode($storedList, true, flags: JSON_THROW_ON_ERROR));

        $this->assertSame($stored, json_encode($read->toArray(), JSON_THROW_ON_ERROR));
        $this->assertSame(self::RULE_DIGEST, $read->digest());
        $this->assertSame(
            $storedList,
            json_encode(array_map(fn (CommandRule $rule) => $rule->toArray(), $readList), JSON_THROW_ON_ERROR),
        );
        $this->assertSame(
            [self::RULE_DIGEST, self::REPLACING_DIGEST],
            array_map(fn (CommandRule $rule) => $rule->digest(), $readList),
        );
    }

    private function checkRule(): CommandRule
    {
        $rules = array_filter(
            $this->app->make(CoreRules::class)->all(),
            fn (CommandRule $rule): bool => $rule->id === self::CHECK_RULE,
        );

        return array_values($rules)[0];
    }

    private function readBack(CommandRule $rule): CommandRule
    {
        return CommandRule::from(json_decode(json_encode($rule->toArray(), JSON_THROW_ON_ERROR), true));
    }
}
