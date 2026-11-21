<?php

declare(strict_types=1);

namespace App\Profiles\Enums;

use App\Drivers\Enums\HookDriver;
use App\Profiles\Exceptions\SignInMethodMissing;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * How an account signs in to its program: the program's own OAuth sign-in, or a long-lived provider token or an API
 * key the owner gives, which the journal passes on to the program.
 */
#[TypeScript]
enum SignInMethod: string
{
    case OAuth = 'oauth';
    case ProviderToken = 'provider_token';
    case ApiKey = 'api_key';

    /**
     * Whether the owner gives a value, a token or a key, that the journal passes on to the program.
     */
    public function isSecret(): bool
    {
        return $this !== self::OAuth;
    }

    /**
     * The name a new account of this method takes when its sign-in shows no name of its own, such as 'Claude Code'
     * for an OAuth sign-in or 'Claude Code API key' for a key.
     */
    public function accountNameFor(string $driverName): string
    {
        return match ($this) {
            self::OAuth => $driverName,
            self::ApiKey => "{$driverName} API key",
            self::ProviderToken => "{$driverName} setup token",
        };
    }

    /**
     * The one sentence the sign-in form shows about how the method is paid for or how long it lasts.
     */
    public function billingNote(): string
    {
        return match ($this) {
            self::OAuth => 'Uses your subscription.',
            self::ApiKey => 'You pay for what agents use.',
            self::ProviderToken => 'Uses your subscription.',
        };
    }

    /**
     * The short word the method's card shows on its right about what it bills.
     */
    public function billingLabel(): string
    {
        return $this === self::ApiKey ? 'API' : 'Subscription';
    }

    /**
     * The title of the method's card for a program, such as 'Sign in with Claude'.
     *
     * @throws SignInMethodMissing when the program has no such sign-in
     */
    public function title(HookDriver $driver): string
    {
        return match ([$driver, $this]) {
            [HookDriver::ClaudeCode, self::OAuth] => 'Sign in with Claude',
            [HookDriver::Codex, self::OAuth] => 'Sign in with ChatGPT',
            [HookDriver::ClaudeCode, self::ProviderToken] => 'Setup token',
            [HookDriver::ClaudeCode, self::ApiKey], [HookDriver::Codex, self::ApiKey] => 'API key',
            default => throw SignInMethodMissing::for($driver->value, $this->value),
        };
    }

    /**
     * The one sentence the method's card shows on how it works for the user.
     *
     * @throws SignInMethodMissing when the program has no such sign-in
     */
    public function description(HookDriver $driver): string
    {
        return match ([$driver, $this]) {
            [HookDriver::ClaudeCode, self::OAuth] => "Sign in on Claude's site, then paste the code it gives you.",
            [HookDriver::ClaudeCode, self::ProviderToken] => 'Paste a token made with claude setup-token. '
                .'Suits a server.',
            [HookDriver::ClaudeCode, self::ApiKey] => 'Paste a key from the Anthropic Console. '
                .'You pay for what agents use.',
            [HookDriver::Codex, self::OAuth] => "Enter a short code on OpenAI's site. The rest happens by itself.",
            [HookDriver::Codex, self::ApiKey] => 'Paste a key from the OpenAI platform. You pay for what agents use.',
            default => throw SignInMethodMissing::for($driver->value, $this->value),
        };
    }

    /**
     * Where the user gets the token or key a secret method asks for; a sign-in that is not secret asks for none.
     *
     * @throws SignInMethodMissing when the program has no such sign-in
     */
    public function secretSource(HookDriver $driver): string|null
    {
        return match ([$driver, $this]) {
            [HookDriver::ClaudeCode, self::OAuth], [HookDriver::Codex, self::OAuth] => null,
            [HookDriver::ClaudeCode, self::ProviderToken] => 'On a computer where you are signed in to Claude '
                .'Code, run claude setup-token in a terminal and copy the token it prints.',
            [HookDriver::ClaudeCode, self::ApiKey] => 'In the Anthropic Console, open API keys and create a key. Copy '
                .'it right away: the Console shows it only once.',
            [HookDriver::Codex, self::ApiKey] => 'On the OpenAI platform, open API keys and create a secret key.',
            default => throw SignInMethodMissing::for($driver->value, $this->value),
        };
    }
}
