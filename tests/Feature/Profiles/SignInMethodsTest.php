<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Data\Profiles\SignInMethodData;
use App\Enums\SignInMethod;
use App\Exceptions\SignInMethodMissing;
use App\Support\ClaudeSignIn;
use App\Support\CodexSignIn;
use App\Support\DefaultDrivers;
use App\Support\SignInProtocols;
use Tests\TestCase;

/**
 * Each driver declares the sign-in methods its host offers, OAuth first, and a method it does not declare is refused
 * naming the driver, the method and the build it is pinned to.
 */
final class SignInMethodsTest extends TestCase
{
    private const string NO_PROVIDER_TOKEN = 'codex has no provider_token sign-in on this host (pinned build 0.165.0).';

    private const string SUBSCRIPTION_NOTE = 'Your Claude subscription pays for what agents use.';

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
        $this->expectExceptionMessage(self::NO_PROVIDER_TOKEN);

        $protocols->for('codex', SignInMethod::ProviderToken);
    }

    public function test_only_a_token_and_a_key_are_secret_and_each_method_has_a_billing_note(): void
    {
        $secrets = array_filter(SignInMethod::cases(), fn (SignInMethod $method) => $method->isSecret());

        $this->assertSame([SignInMethod::ProviderToken, SignInMethod::ApiKey], array_values($secrets));
        $this->assertSame(
            [
                'Your Claude subscription pays for what agents use.',
                'Your Claude subscription pays for what agents use. Checking it may send one small request with it.',
                'Billed to the API key, apart from any subscription. Checking it may send one small request with it.',
                'Your ChatGPT subscription pays for what agents use.',
                'Billed to the API key by what agents use. Checking it may send one small request with it.',
            ],
            array_map(fn (array $pair) => $pair[1]->billingNote($pair[0]), [
                [DefaultDrivers::CLAUDE_CODE, SignInMethod::OAuth],
                [DefaultDrivers::CLAUDE_CODE, SignInMethod::ProviderToken],
                [DefaultDrivers::CLAUDE_CODE, SignInMethod::ApiKey],
                [DefaultDrivers::CODEX, SignInMethod::OAuth],
                [DefaultDrivers::CODEX, SignInMethod::ApiKey],
            ]),
        );
    }

    public function test_each_method_card_says_how_it_works_what_it_bills_and_where_to_get_its_secret(): void
    {
        $cards = array_map(
            fn (array $pair) => SignInMethodData::fromMethod(...$pair)->toArray(),
            [
                [DefaultDrivers::CLAUDE_CODE, SignInMethod::OAuth],
                [DefaultDrivers::CLAUDE_CODE, SignInMethod::ProviderToken],
                [DefaultDrivers::CLAUDE_CODE, SignInMethod::ApiKey],
                [DefaultDrivers::CODEX, SignInMethod::OAuth],
                [DefaultDrivers::CODEX, SignInMethod::ApiKey],
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
                "Sign in on Claude's site, then paste the code it gives you.",
                null,
            ],
            [
                'Setup token',
                'Subscription',
                'Paste a token made with claude setup-token. Suits a server.',
                'On a computer where you are signed in to Claude Code, run claude setup-token in a terminal and copy '
                    .'the token it prints.',
            ],
            [
                'API key',
                'API',
                'Paste a key from the Anthropic Console.',
                'In the Anthropic Console, open API keys and create a key. Copy it right away: the Console shows it '
                    .'only once.',
            ],
            [
                'Sign in with ChatGPT',
                'Subscription',
                "Enter a short code on OpenAI's site. The rest happens by itself.",
                null,
            ],
            [
                'API key',
                'API',
                'Paste a key from the OpenAI platform.',
                'On the OpenAI platform, open API keys and create a secret key.',
            ],
        ], $shown);
        $this->assertSame(self::SUBSCRIPTION_NOTE, $cards[0]['billingNote']);
    }

    public function test_a_card_for_a_sign_in_the_program_lacks_is_refused(): void
    {
        $this->expectException(SignInMethodMissing::class);

        SignInMethod::ProviderToken->title(DefaultDrivers::CODEX);
    }
}
