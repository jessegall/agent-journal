<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Processes\Rules\CoreRules;
use App\Processes\Values\CommandRule;
use App\Processes\Values\RuleReference;
use App\Processes\Values\RuleScope;
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

    private const string RULE_DIGEST = '595e6cd96ff306222849a67250dc0a4957f9b2f02865d29cf132ad0703f53217';

    private const string CONTRACT_DIGEST = 'aba6af7c7fd2bec5ef2ace0c95de257fa5f7861908dd4e1ee996a623936e32e7';

    private const string REPLACING_DIGEST = 'c3af78ec963364d0f5b2ae188dd1b1f10280a80d99dea6b9a90f0171e911fc08';

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
        $readList = CommandRule::listFromJson($storedList);

        $this->assertSame($stored, json_encode(CommandRule::fromJson($stored)->toArray(), JSON_THROW_ON_ERROR));
        $this->assertSame(self::RULE_DIGEST, CommandRule::fromJson($stored)->digest());
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
        return CommandRule::fromArray(json_decode(json_encode($rule->toArray(), JSON_THROW_ON_ERROR), true));
    }
}
