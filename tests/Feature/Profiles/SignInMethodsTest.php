<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Http\Data\Profiles\SignInMethodData;
use App\Profiles\Enums\SignInMethod;
use App\Profiles\Exceptions\SignInMethodMissing;
use App\Profiles\Support\ClaudeSignIn;
use App\Profiles\Support\CodexSignIn;
use App\Profiles\Support\SignInProtocols;
use App\Programs\Enums\HookProgram;
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

    public function test_each_method_card_says_how_it_works_what_it_bills_and_where_to_get_its_secret(): void
    {
        $cards = array_map(
            fn (array $pair) => SignInMethodData::fromMethod(...$pair)->toArray(),
            [
                [HookProgram::ClaudeCode, SignInMethod::OAuth],
                [HookProgram::ClaudeCode, SignInMethod::ProviderToken],
                [HookProgram::ClaudeCode, SignInMethod::ApiKey],
                [HookProgram::Codex, SignInMethod::OAuth],
                [HookProgram::Codex, SignInMethod::ApiKey],
            ],
        );
        $shown = array_map(
            fn (array $card) => [
                $card['title'],
                $card['billingLabel'],
                $card['description'],
                $card['secretSource'] ?? null,
            ],
            $cards,
        );

        $this->assertSame([
            [
                'Sign in with Claude',
                'Subscription',
                "Opens Claude's sign-in page. You sign in there and paste back the code it shows.",
                null,
            ],
            [
                'Provider token',
                'Subscription',
                'Paste a long-lived token made with claude setup-token. Suits a server.',
                'On a computer where you are signed in to Claude Code, run claude setup-token in a terminal and copy '
                    .'the token it prints.',
            ],
            [
                'API key',
                'API usage',
                'Paste a key from the Anthropic Console. Every request is billed to that API account.',
                'In the Anthropic Console, open API keys and create a key. Copy it right away: the Console shows it '
                    .'only once.',
            ],
            [
                'Sign in with ChatGPT',
                'Subscription',
                "Shows a short code. You enter it on OpenAI's page, and the account appears here by itself.",
                null,
            ],
            [
                'API key',
                'API usage',
                'Paste a key from the OpenAI platform. Every request is billed to that API account.',
                'On the OpenAI platform, open API keys and create a secret key.',
            ],
        ], $shown);
        $this->assertSame('Uses your subscription.', $cards[0]['billingNote']);
    }

    public function test_a_card_for_a_sign_in_the_program_lacks_is_refused(): void
    {
        $this->expectException(SignInMethodMissing::class);

        SignInMethod::ProviderToken->title(HookProgram::Codex);
    }
}
