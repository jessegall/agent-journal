<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Data\Accounts\DriverMethodsData;
use App\Enums\Accounts\SignInMethod;
use App\Exceptions\SignInMethodMissing;
use App\Support\ClaudeSignIn;
use App\Support\CodexSignIn;
use App\Support\DefaultDrivers;
use App\Support\SignInProtocols;
use App\Values\SignInCard;
use Tests\TestCase;

/**
 * Each driver declares the sign-in methods its host offers, OAuth first, and a method it does not declare is refused
 * naming the driver, the method and the build it is pinned to.
 */
final class SignInMethodsTest extends TestCase
{
    private const string NO_PROVIDER_TOKEN = 'codex has no provider_token sign-in on this host (pinned build 0.165.0).';

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

    public function test_only_a_token_and_a_key_are_secret_and_checking_one_says_it_may_send_a_request(): void
    {
        $secrets = array_filter(SignInMethod::cases(), fn (SignInMethod $method) => $method->isSecret());
        $protocols = $this->app->make(SignInProtocols::class);

        $this->assertSame([SignInMethod::ProviderToken, SignInMethod::ApiKey], array_values($secrets));

        foreach (DefaultDrivers::familyKeys() as $driver) {
            foreach ($protocols->methodsOf($driver) as $method) {
                $this->assertSame(
                    $method->isSecret(),
                    str_ends_with($protocols->for($driver, $method)->card()->billingNote, SignInCard::CHECK_SENDS_A_REQUEST),
                );
            }
        }
    }

    public function test_each_method_card_shows_what_its_registered_sign_in_says_and_a_secret_names_its_source(): void
    {
        $protocols = $this->app->make(SignInProtocols::class);

        foreach (DefaultDrivers::familyKeys() as $driver) {
            $listed = DriverMethodsData::fromProtocols($driver, $protocols);

            foreach ($listed->methods as $shown) {
                $card = $protocols->for($driver, $shown->method)->card();

                $this->assertSame(
                    [$card->title, $card->description, $card->billingNote, $card->secretSource],
                    [$shown->title, $shown->description, $shown->billingNote, $shown->secretSource],
                );
                $this->assertSame($shown->method->isSecret(), $shown->secretSource !== null);
            }
        }
    }
}
