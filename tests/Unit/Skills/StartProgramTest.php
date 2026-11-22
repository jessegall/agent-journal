<?php

declare(strict_types=1);

namespace Tests\Unit\Skills;

use App\CoreApi;
use App\Drivers\Contracts\DriverCatalogue;
use App\Drivers\Values\DriverKey;
use App\Drivers\Values\ProviderKey;
use App\Skills\Support\StartDriver;
use Tests\TestCase;

/**
 * A session's driver gives its driver and provider keys from the driver registration, never from a model name.
 */
final class StartProgramTest extends TestCase
{
    public function test_codex_and_claude_code_resolve_their_provider(): void
    {
        $codex = StartDriver::of('codex', $this->app->make(DriverCatalogue::class));
        $claude = StartDriver::of('claude-code', $this->app->make(DriverCatalogue::class));

        $this->assertSame('codex', $codex->driver?->key);
        $this->assertSame('openai', $codex->provider?->key);
        $this->assertSame('claude-code', $claude->driver?->key);
        $this->assertSame('anthropic', $claude->provider?->key);
    }

    public function test_an_unknown_program_resolves_no_provider(): void
    {
        $unknown = StartDriver::of('gemini-cli', $this->app->make(DriverCatalogue::class));

        $this->assertSame('gemini-cli', $unknown->driver?->key);
        $this->assertNull($unknown->provider);
        $this->assertNull(StartDriver::of(null, $this->app->make(DriverCatalogue::class))->driver);
    }

    public function test_the_program_and_provider_keys_are_exported(): void
    {
        $exports = CoreApi::exports();

        $this->assertContains(DriverKey::class, $exports->valueClasses);
        $this->assertContains(ProviderKey::class, $exports->valueClasses);
    }
}
