<?php

declare(strict_types=1);

namespace Tests\Unit\Skills;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Agents\Enums\AgentRole;
use App\Profiles\Enums\ProfileType;
use App\Profiles\Values\ProfileKey;
use App\Profiles\Values\ProfileSnapshot;
use App\Skills\Conditions\Conditions;
use App\Skills\Enums\ConditionOutcome;
use App\Skills\Exceptions\SkillConditionInvalid;
use App\Skills\Support\ConditionTree;
use App\Skills\Values\LaunchProfile;
use App\Skills\Values\ProgramKey;
use App\Skills\Values\ProviderKey;
use App\Skills\Values\SkillContext;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * Conditions are one typed, three-valued tree: PHP and the JSON wire format give the same answer, an unavailable fact
 * never turns into a match, and a malformed tree is refused whole, naming the field or limit.
 */
final class ConditionTreeTest extends TestCase
{
    private const string SECTION_6_JSON = '{"type":"all","version":1,"children":[{"type":"profiles","version":1,"keys":["journal-reviewer"]},{"type":"programs","version":1,"keys":["codex"]}]}';

    public function test_the_php_condition_and_the_section_6_json_agree_for_the_same_context(): void
    {
        $php = Conditions::all(Conditions::profiles(ProfileKey::from('journal-reviewer')), Conditions::programs(ProgramKey::from('codex')));
        $json = $this->tree()->fromJson(self::SECTION_6_JSON);

        $this->assertSame(json_decode(self::SECTION_6_JSON, true), $php->toArray());

        foreach ([$this->reviewerOn('codex'), $this->reviewerOn('claude-code'), $this->mainAgentOn('codex')] as $context) {
            $this->assertSame($php->evaluate($context)->outcome, $json->evaluate($context)->outcome);
        }

        $this->assertSame(ConditionOutcome::Match, $json->evaluate($this->reviewerOn('codex'))->outcome);
        $this->assertSame(ConditionOutcome::NoMatch, $json->evaluate($this->reviewerOn('claude-code'))->outcome);
    }

    public function test_main_agent_reads_the_trusted_role_and_agent_types_read_the_profile_type(): void
    {
        $this->assertSame(ConditionOutcome::Match, Conditions::mainAgent()->evaluate($this->mainAgentOn('codex'))->outcome);
        $this->assertSame(ConditionOutcome::NoMatch, Conditions::mainAgent()->evaluate($this->reviewerOn('codex'))->outcome);
        $this->assertSame(ConditionOutcome::Match, Conditions::agentTypes(ProfileType::ReadOnlyHelper)->evaluate($this->reviewerOn('codex'))->outcome);
        $this->assertSame(ConditionOutcome::NoMatch, Conditions::agentTypes(ProfileType::WritingHelper)->evaluate($this->reviewerOn('codex'))->outcome);
        $this->assertSame('profile-free', Conditions::profiles(ProfileKey::from('journal-reviewer'))->evaluate($this->mainAgentOn('codex'))->reason);
    }

    public function test_an_unavailable_fact_stays_unavailable_through_not_and_groups(): void
    {
        $unknownProvider = $this->reviewerOn('claude-code', null);
        $providers = Conditions::providers(ProviderKey::from('openai'));

        $this->assertSame(ConditionOutcome::Unavailable, $providers->evaluate($unknownProvider)->outcome);
        $this->assertSame(ConditionOutcome::Unavailable, Conditions::not($providers)->evaluate($unknownProvider)->outcome);
        $this->assertSame(ConditionOutcome::Unavailable, Conditions::all(Conditions::everyone(), $providers)->evaluate($unknownProvider)->outcome);
        $this->assertSame(ConditionOutcome::NoMatch, Conditions::all(Conditions::mainAgent(), $providers)->evaluate($unknownProvider)->outcome);
        $this->assertSame(ConditionOutcome::Match, Conditions::any(Conditions::everyone(), $providers)->evaluate($unknownProvider)->outcome);
        $this->assertSame(ConditionOutcome::Unavailable, Conditions::any(Conditions::mainAgent(), $providers)->evaluate($unknownProvider)->outcome);
        $this->assertSame(ConditionOutcome::Match, Conditions::not(Conditions::mainAgent())->evaluate($unknownProvider)->outcome);
    }

    public function test_an_unregistered_named_condition_is_unavailable_and_keeps_its_source(): void
    {
        $wire = ['type' => 'named', 'version' => 2, 'key' => 'plans.active-plan', 'parameters' => ['state' => 'started']];
        $named = $this->tree()->hydrate($wire);

        $this->assertSame(ConditionOutcome::Unavailable, $named->evaluate($this->reviewerOn('codex'))->outcome);
        $this->assertSame('condition-missing', $named->evaluate($this->reviewerOn('codex'))->reason);
        $this->assertSame($wire, $named->toArray());
    }

    /**
     * @return iterable<string, array{mixed, string}>
     */
    public static function malformedTrees(): iterable
    {
        yield 'empty any' => [['type' => 'any', 'version' => 1, 'children' => []], 'condition.children needs at least one condition'];
        yield 'not with two children' => [['type' => 'not', 'version' => 1, 'children' => [['type' => 'everyone', 'version' => 1], ['type' => 'everyone', 'version' => 1]]], 'condition.children needs exactly one condition'];
        yield 'unknown type' => [['type' => 'sometimes', 'version' => 1], 'condition.type names the unknown type sometimes'];
        yield 'unknown version' => [['type' => 'everyone', 'version' => 2], 'condition.version is 2'];
        yield 'empty keys' => [['type' => 'programs', 'version' => 1, 'keys' => []], 'condition.keys needs at least one key'];
        yield 'wrong key type' => [['type' => 'profiles', 'version' => 1, 'keys' => [7]], 'condition.keys[0] is not text'];
        yield 'invalid agent type' => [['type' => 'agent-types', 'version' => 1, 'keys' => ['worker']], 'condition.keys holds a key that is not valid'];
        yield 'extra field' => [['type' => 'everyone', 'version' => 1, 'keys' => ['x']], 'condition.keys is not a field of this type'];
        yield 'nested field' => [['type' => 'all', 'version' => 1, 'children' => [['type' => 'profiles', 'version' => 1]]], 'condition.children[0].keys needs at least one key'];
        yield '17 deep' => [self::nested(17), 'nested deeper than 16 levels'];
        yield '257 nodes' => [['type' => 'any', 'version' => 1, 'children' => array_fill(0, 256, ['type' => 'everyone', 'version' => 1])], 'more than 256 nodes'];
        yield 'large parameters' => [['type' => 'named', 'version' => 1, 'key' => 'notes.big', 'parameters' => ['text' => str_repeat('a', 32_768)]], 'more than 32768 bytes'];
    }

    #[DataProvider('malformedTrees')]
    public function test_a_malformed_tree_is_refused_naming_the_field_or_limit(mixed $wire, string $message): void
    {
        $this->expectException(SkillConditionInvalid::class);
        $this->expectExceptionMessage($message);

        $this->tree()->hydrate($wire);
    }

    public function test_a_16_deep_tree_is_accepted(): void
    {
        $this->assertSame(ConditionOutcome::Match, $this->tree()->hydrate(self::nested(16))->evaluate($this->mainAgentOn('codex'))->outcome);
    }

    /**
     * A tree of nested all groups, depth levels deep in all, with everyone at the bottom.
     *
     * @return array<string, mixed>
     */
    private static function nested(int $depth): array
    {
        $node = ['type' => 'everyone', 'version' => 1];

        for ($level = 1; $level < $depth; $level++) {
            $node = ['type' => 'all', 'version' => 1, 'children' => [$node]];
        }

        return $node;
    }

    private function tree(): ConditionTree
    {
        return $this->app->make(ConditionTree::class);
    }

    private function reviewerOn(string $program, ?string $provider = 'openai'): SkillContext
    {
        $snapshot = ProfileSnapshot::from(['key' => ProfileKey::from('journal-reviewer'), 'revision' => 1, 'type' => ProfileType::ReadOnlyHelper, 'instructions' => 'Review.', 'model' => 'opus', 'skillAllowlist' => null, 'requiredSkills' => []]);

        return new SkillContext(new ActorIdentity(ActorType::Agent, TestIds::of(2)), AgentRole::ReadOnlyHelper, TestIds::of(3), 'main', LaunchProfile::of($snapshot), ProgramKey::from($program), $provider === null ? null : ProviderKey::from($provider));
    }

    private function mainAgentOn(string $program): SkillContext
    {
        return new SkillContext(new ActorIdentity(ActorType::Agent, TestIds::of(1)), AgentRole::MainAgent, TestIds::of(4), 'main', LaunchProfile::profileFree(), ProgramKey::from($program), ProviderKey::from('openai'));
    }
}
