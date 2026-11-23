<?php

declare(strict_types=1);

namespace App\Enums;

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
     * What kind of account the method makes, as the accounts list names it under an account: 'Claude Code
     * subscription' for an OAuth sign-in, 'Codex API key' for a key.
     */
    public function accountTypeFor(string $driverName): string
    {
        return match ($this) {
            self::OAuth => "{$driverName} subscription",
            self::ApiKey, self::ProviderToken => $this->accountNameFor($driverName),
        };
    }

    /**
     * The short word the method's card shows on its right about what it bills.
     */
    public function billingLabel(): string
    {
        return $this === self::ApiKey ? 'API' : 'Subscription';
    }
}
