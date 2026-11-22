<?php

declare(strict_types=1);

namespace App\Enums;

use App\Exceptions\SignInMethodMissing;
use App\Support\DefaultDrivers;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * How an account signs in to its driver: the driver's own OAuth sign-in, or a long-lived provider token or an API
 * key the owner gives, which the journal passes on to the driver.
 */
#[TypeScript]
enum SignInMethod: string
{
    case OAuth = 'oauth';
    case ProviderToken = 'provider_token';
    case ApiKey = 'api_key';

    /**
     * Whether the owner gives a value, a token or a key, that the journal passes on to the driver.
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
     * The sentences the sign-in form shows about how the driver's method is paid for, and, for a key or token, that
     * checking it may send one small request with it.
     *
     * @throws SignInMethodMissing when the driver has no such sign-in
     */
    public function billingNote(string $driver): string
    {
        $check = ' Checking it may send one small request with it.';

        return match ([$driver, $this]) {
            [DefaultDrivers::CLAUDE_CODE, self::OAuth] => 'Your Claude subscription pays for what agents use.',
            [DefaultDrivers::CLAUDE_CODE, self::ProviderToken] => 'Your Claude subscription pays for what agents use.'.$check,
            [DefaultDrivers::CLAUDE_CODE, self::ApiKey] => 'Billed to the API key, apart from any subscription.'.$check,
            [DefaultDrivers::CODEX, self::OAuth] => 'Your ChatGPT subscription pays for what agents use.',
            [DefaultDrivers::CODEX, self::ApiKey] => 'Billed to the API key by what agents use.'.$check,
            default => throw SignInMethodMissing::for($driver, $this->value),
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
     * The title of the method's card for a driver, such as 'Sign in with Claude'.
     *
     * @throws SignInMethodMissing when the driver has no such sign-in
     */
    public function title(string $driver): string
    {
        return match ([$driver, $this]) {
            [DefaultDrivers::CLAUDE_CODE, self::OAuth] => 'Sign in with Claude',
            [DefaultDrivers::CODEX, self::OAuth] => 'Sign in with ChatGPT',
            [DefaultDrivers::CLAUDE_CODE, self::ProviderToken] => 'Setup token',
            [DefaultDrivers::CLAUDE_CODE, self::ApiKey], [DefaultDrivers::CODEX, self::ApiKey] => 'API key',
            default => throw SignInMethodMissing::for($driver, $this->value),
        };
    }

    /**
     * The one sentence the method's card shows on how it works for the user.
     *
     * @throws SignInMethodMissing when the driver has no such sign-in
     */
    public function description(string $driver): string
    {
        return match ([$driver, $this]) {
            [DefaultDrivers::CLAUDE_CODE, self::OAuth] => "Sign in on Claude's site, then paste the code it gives you.",
            [DefaultDrivers::CLAUDE_CODE, self::ProviderToken] => 'Paste a token made with claude setup-token. '
                .'Suits a server.',
            [DefaultDrivers::CLAUDE_CODE, self::ApiKey] => 'Paste a key from the Anthropic Console.',
            [DefaultDrivers::CODEX, self::OAuth] => "Enter a short code on OpenAI's site. The rest happens by itself.",
            [DefaultDrivers::CODEX, self::ApiKey] => 'Paste a key from the OpenAI platform.',
            default => throw SignInMethodMissing::for($driver, $this->value),
        };
    }

    /**
     * Where the user gets the token or key a secret method asks for; a sign-in that is not secret asks for none.
     *
     * @throws SignInMethodMissing when the driver has no such sign-in
     */
    public function secretSource(string $driver): string|null
    {
        return match ([$driver, $this]) {
            [DefaultDrivers::CLAUDE_CODE, self::OAuth], [DefaultDrivers::CODEX, self::OAuth] => null,
            [DefaultDrivers::CLAUDE_CODE, self::ProviderToken] => 'On a computer where you are signed in to Claude '
                .'Code, run claude setup-token in a terminal and copy the token it prints.',
            [DefaultDrivers::CLAUDE_CODE, self::ApiKey] => 'In the Anthropic Console, open API keys and create a key. Copy '
                .'it right away: the Console shows it only once.',
            [DefaultDrivers::CODEX, self::ApiKey] => 'On the OpenAI platform, open API keys and create a secret key.',
            default => throw SignInMethodMissing::for($driver, $this->value),
        };
    }
}
