<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks\Programs;

use App\Hooks\Decisions\Decision;
use App\Hooks\Enums\RewriteSupport;
use App\Hooks\Exceptions\UnsupportedHook;
use App\Hooks\Programs\ProgramCapabilities;
use App\Hooks\Programs\ProgramToolInput;
use App\Hooks\Stack\AgentStack;
use App\Hooks\Stack\HookAnswer;
use App\Hooks\States\AgentState;
use ReflectionClass;
use Tests\Fixtures\Hooks\InMemoryStateFactory;
use Tests\TestCase;

final class ProgramCapabilitiesTest extends TestCase
{
    public function test_capabilities_name_the_contract_and_the_hooks_they_map(): void
    {
        $capabilities = $this->capabilities(RewriteSupport::WithoutApproval);

        $this->assertSame('pre-tool and stop replies, checked against documentation on 2026-11-17', $capabilities->schemaContract);
        $this->assertTrue($capabilities->supports('onShellCommand'));
        $this->assertTrue($capabilities->supports('onStop'));
        $this->assertFalse($capabilities->supports('onCompaction'));
    }

    public function test_a_hook_the_adapter_does_not_map_is_refused_by_name(): void
    {
        $this->expectExceptionObject(UnsupportedHook::for('Test program', 'onCompaction'));

        $this->capabilities(RewriteSupport::WithoutApproval)->checkSupports('onCompaction');
    }

    public function test_a_hook_the_adapter_maps_passes(): void
    {
        $this->capabilities(RewriteSupport::WithoutApproval)->checkSupports('onStop');

        $this->addToAssertionCount(1);
    }

    public function test_the_rewrite_support_decides_between_a_rewrite_and_a_refusal(): void
    {
        $answer = new HookAnswer(Decision::rewrite('journal run tests'), [], [], new AgentStack([], new InMemoryStateFactory));
        $original = new ProgramToolInput(['command' => 'composer test']);

        $taken = $this->capabilities(RewriteSupport::WithoutApproval)->rewrites->reply($answer, $original);
        $refused = $this->capabilities(RewriteSupport::NeedsApproval)->rewrites->reply($answer, $original);

        $this->assertStringContainsString('"updatedInput":{"command":"journal run tests"}', $taken->stdout);
        $this->assertStringContainsString('"permissionDecision":"deny"', $refused->stdout);
    }

    public function test_every_hook_method_an_adapter_can_name_is_a_real_hook(): void
    {
        $hookMethods = array_map(
            fn ($method) => $method->getName(),
            array_filter((new ReflectionClass(AgentState::class))->getMethods(), fn ($method) => str_starts_with($method->getName(), 'on')),
        );

        $this->assertSame([], array_diff(['onShellCommand', 'onStop'], $hookMethods));
    }

    public function test_the_evidence_lives_in_one_document(): void
    {
        $evidence = (string) file_get_contents(base_path('docs/hooks/program-capabilities.md'));

        $this->assertStringContainsString('## Claude Code', $evidence);
        $this->assertStringContainsString('## Codex', $evidence);
        $this->assertStringContainsString('X-Journal-Call-Signature', $evidence);
    }

    private function capabilities(RewriteSupport $rewrites): ProgramCapabilities
    {
        return new ProgramCapabilities(
            'Test program',
            'pre-tool and stop replies, checked against documentation on 2026-11-17',
            ['onShellCommand', 'onStop'],
            $rewrites,
        );
    }
}
