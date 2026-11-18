<?php

declare(strict_types=1);

namespace Tests\Unit\Skills;

use App\CoreApi;
use App\Programs\Enums\HookProgram;
use App\Skills\Support\LaunchProgram;
use App\Skills\Values\ProgramKey;
use App\Skills\Values\ProviderKey;
use Tests\TestCase;

/**
 * A session's program gives its program and provider keys from the program registration, never from a model name.
 */
final class LaunchProgramTest extends TestCase
{
    public function test_codex_and_claude_code_resolve_their_provider(): void
    {
        $codex = LaunchProgram::of('codex');
        $claude = LaunchProgram::of('claude-code');

        $this->assertSame('codex', $codex->program?->key);
        $this->assertSame('openai', $codex->provider?->key);
        $this->assertSame('claude-code', $claude->program?->key);
        $this->assertSame('anthropic', $claude->provider?->key);
    }

    public function test_an_unknown_program_resolves_no_provider(): void
    {
        $unknown = LaunchProgram::of('gemini-cli');

        $this->assertSame('gemini-cli', $unknown->program?->key);
        $this->assertNull($unknown->provider);
        $this->assertNull(LaunchProgram::of(null)->program);
    }

    public function test_the_keys_are_exported_and_the_program_enum_is_not(): void
    {
        $exports = CoreApi::exports();

        $this->assertContains(ProgramKey::class, $exports->values);
        $this->assertContains(ProviderKey::class, $exports->values);
        $this->assertFalse($exports->has(HookProgram::class));
    }
}
