<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Profiles\Enums\SignInMethod;
use App\Profiles\Exceptions\SignInMethodMissing;
use App\Profiles\Support\ClaudeSignIn;
use App\Profiles\Support\CodexSignIn;
use App\Profiles\Support\SignInProtocols;
use Tests\TestCase;

/**
 * Each program declares the sign-in methods its host offers, OAuth first, and a method it does not declare is refused
 * naming the program, the method and the build it is pinned to.
 */
final class SignInMethodsTest extends TestCase
{
    public function test_each_program_declares_its_methods_oauth_first(): void
    {
        $protocols = $this->app->make(SignInProtocols::class);
        $claude = [SignInMethod::OAuth, SignInMethod::ProviderToken, SignInMethod::ApiKey];

        $this->assertSame($claude, $protocols->methodsOf('claude-code'));
        $this->assertSame([SignInMethod::OAuth, SignInMethod::ApiKey], $protocols->methodsOf('codex'));
        $this->assertInstanceOf(ClaudeSignIn::class, $protocols->for('claude-code', SignInMethod::OAuth));
        $this->assertInstanceOf(CodexSignIn::class, $protocols->for('codex'));
    }

    public function test_a_method_the_program_does_not_declare_is_refused_naming_its_pinned_build(): void
    {
        $protocols = $this->app->make(SignInProtocols::class);

        $this->expectException(SignInMethodMissing::class);
        $this->expectExceptionMessage('codex has no provider_token sign-in on this host (pinned build 0.165.0).');

        $protocols->for('codex', SignInMethod::ProviderToken);
    }

    public function test_only_a_token_and_a_key_are_secret_and_each_method_has_a_billing_note(): void
    {
        $secrets = array_filter(SignInMethod::cases(), fn (SignInMethod $method) => $method->isSecret());

        $this->assertSame([SignInMethod::ProviderToken, SignInMethod::ApiKey], array_values($secrets));
        $this->assertSame('Uses your subscription.', SignInMethod::OAuth->billingNote());
    }
}
