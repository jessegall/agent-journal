<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks\Drivers;

use App\Enums\Drivers\RewriteSupport;
use App\Exceptions\UnsupportedHook;
use App\Support\Decisions\Decision;
use App\Support\Drivers\DriverCapabilities;
use App\Support\Drivers\DriverReplies;
use App\Support\Inputs\Values\DriverToolInput;
use App\Support\ReflectedMethod;
use App\Support\Reflector;
use App\Support\Stack\AgentStack;
use App\Support\Stack\HookAnswer;
use App\Support\States\AgentState;
use App\Values\StackTarget;
use Tests\Fixtures\Hooks\InMemoryStateFactory;
use Tests\Support\TestText;
use Tests\TestCase;

final class ProgramCapabilitiesTest extends TestCase
{
    private const string SCHEMA_CONTRACT = 'pre-tool and stop replies, checked against documentation on 2026-11-17';

    private const string CLAUDE_HEADING = '## Claude Code';

    private const string CODEX_HEADING = '## Codex';

    private const string CLAUDE_VERSION_ROW = '| Driver and pinned version | Claude Code 2.1.323,';

    private const string CODEX_VERSION_ROW = '| Driver and pinned version | codex-cli 0.165.0,';

    private const string NO_PRODUCTION_RUN = 'No production driver runs under it yet:';

    public function test_capabilities_name_the_contract_and_the_hooks_they_map(): void
    {
        $capabilities = $this->capabilities(RewriteSupport::WithoutApproval);

        $this->assertSame(self::SCHEMA_CONTRACT, $capabilities->schemaContract);
        $this->assertTrue($capabilities->supports('onShellCommand'));
        $this->assertTrue($capabilities->supports('onStop'));
        $this->assertFalse($capabilities->supports('onCompaction'));
    }

    public function test_a_hook_the_adapter_does_not_map_is_refused_by_name(): void
    {
        $this->expectExceptionObject(UnsupportedHook::for('Test driver', 'onCompaction'));

        $this->capabilities(RewriteSupport::WithoutApproval)->assertSupports('onCompaction');
    }

    public function test_a_hook_the_adapter_maps_passes(): void
    {
        $this->capabilities(RewriteSupport::WithoutApproval)->assertSupports('onStop');

        $this->addToAssertionCount(1);
    }

    public function test_the_rewrite_support_decides_between_a_rewrite_and_a_refusal(): void
    {
        $answer = new HookAnswer(
            Decision::rewrite('journal run tests'),
            [],
            [],
            new AgentStack([], new InMemoryStateFactory(), new StackTarget('agent-1', 'session-1')),
        );
        $original = new DriverToolInput(['command' => 'composer test']);

        $taken = DriverReplies::shell($answer, $original, RewriteSupport::WithoutApproval, TestText::renderer());
        $refused = DriverReplies::shell($answer, $original, RewriteSupport::NeedsApproval, TestText::renderer());

        $this->assertStringContainsString(
            trim((string) json_encode(['updatedInput' => ['command' => 'journal run tests']]), '{}'),
            $taken->stdout,
        );
        $this->assertStringContainsString('"permissionDecision":"deny"', $refused->stdout);
    }

    public function test_every_hook_method_an_adapter_can_name_is_a_real_hook(): void
    {
        $hookMethods = array_map(
            fn (ReflectedMethod $method) => $method->name(),
            array_filter(
                Reflector::of(AgentState::class)->methods(),
                fn (ReflectedMethod $method) => str_starts_with($method->name(), 'on'),
            ),
        );

        $this->assertSame([], array_diff(['onShellCommand', 'onStop'], $hookMethods));
    }

    public function test_the_evidence_lives_in_one_document_with_the_pinned_versions_and_no_production_run(): void
    {
        $evidence = (string) file_get_contents(base_path('docs/hooks/driver-capabilities.md'));

        $this->assertStringContainsString(self::CLAUDE_HEADING, $evidence);
        $this->assertStringContainsString(self::CODEX_HEADING, $evidence);
        $this->assertStringContainsString('X-Journal-Call-Signature', $evidence);
        $this->assertStringContainsString(self::CLAUDE_VERSION_ROW, $evidence);
        $this->assertStringContainsString(self::CODEX_VERSION_ROW, $evidence);
        $this->assertStringContainsString(self::NO_PRODUCTION_RUN, $evidence);
    }

    private function capabilities(RewriteSupport $rewrites): DriverCapabilities
    {
        return new DriverCapabilities(
            'Test driver',
            self::SCHEMA_CONTRACT,
            ['onShellCommand', 'onStop'],
            $rewrites,
        );
    }
}
