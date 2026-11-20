<?php

declare(strict_types=1);

namespace App\Profiles\Enums;

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
     * The one sentence the sign-in form shows about how the method is paid for or how long it lasts.
     */
    public function billingNote(): string
    {
        return match ($this) {
            self::OAuth => 'Uses your subscription.',
            self::ApiKey => 'Billed to your API account.',
            self::ProviderToken => 'Lasts as long as the long-lived token does.',
        };
    }
}
