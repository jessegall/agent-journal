<?php

declare(strict_types=1);

namespace App\Profiles\Enums;

use App\Profiles\Exceptions\SignInMethodMissing;
use App\Programs\Enums\HookProgram;
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
    public function accountNameFor(string $programName): string
    {
        return match ($this) {
            self::OAuth => $programName,
            self::ApiKey => "{$programName} API key",
            self::ProviderToken => "{$programName} provider token",
        };
    }

    /**
     * The one sentence the sign-in form shows about how the method is paid for or how long it lasts.
     */
    public function billingNote(): string
    {
        return match ($this) {
            self::OAuth => 'Uses your subscription.',
            self::ApiKey => 'Billed to your API account.',
            self::ProviderToken => 'Uses your subscription, through a long-lived token provided by Anthropic.',
        };
    }

    /**
     * The short word the method's card shows on its right about what it bills.
     */
    public function billingLabel(): string
    {
        return $this === self::ApiKey ? 'API usage' : 'Subscription';
    }

    /**
     * The title of the method's card for a program, such as 'Sign in with Claude'.
     *
     * @throws SignInMethodMissing when the program has no such sign-in
     */
    public function title(HookProgram $program): string
    {
        return match ([$program, $this]) {
            [HookProgram::ClaudeCode, self::OAuth] => 'Sign in with Claude',
            [HookProgram::Codex, self::OAuth] => 'Sign in with ChatGPT',
            [HookProgram::ClaudeCode, self::ProviderToken] => 'Provider token',
            [HookProgram::ClaudeCode, self::ApiKey], [HookProgram::Codex, self::ApiKey] => 'API key',
            default => throw SignInMethodMissing::for($program->value, $this->value),
        };
    }

    /**
     * The one sentence the method's card shows on how it works for the user.
     *
     * @throws SignInMethodMissing when the program has no such sign-in
     */
    public function description(HookProgram $program): string
    {
        return match ([$program, $this]) {
            [HookProgram::ClaudeCode, self::OAuth] => "Opens Claude's sign-in page. You sign in there and paste back "
                .'the code it shows.',
            [HookProgram::ClaudeCode, self::ProviderToken] => 'Paste a long-lived token made with claude '
                .'setup-token. Suits a server.',
            [HookProgram::ClaudeCode, self::ApiKey] => 'Paste a key from the Anthropic Console. Every request is '
                .'billed to that API account.',
            [HookProgram::Codex, self::OAuth] => "Shows a short code. You enter it on OpenAI's page, and the account "
                .'appears here by itself.',
            [HookProgram::Codex, self::ApiKey] => 'Paste a key from the OpenAI platform. Every request is billed to '
                .'that API account.',
            default => throw SignInMethodMissing::for($program->value, $this->value),
        };
    }

    /**
     * Where the user gets the token or key a secret method asks for; a sign-in that is not secret asks for none.
     *
     * @throws SignInMethodMissing when the program has no such sign-in
     */
    public function secretSource(HookProgram $program): string|null
    {
        return match ([$program, $this]) {
            [HookProgram::ClaudeCode, self::OAuth], [HookProgram::Codex, self::OAuth] => null,
            [HookProgram::ClaudeCode, self::ProviderToken] => 'On a computer where you are signed in to Claude '
                .'Code, run claude setup-token in a terminal and copy the token it prints.',
            [HookProgram::ClaudeCode, self::ApiKey] => 'In the Anthropic Console, open API keys and create a key. Copy '
                .'it right away: the Console shows it only once.',
            [HookProgram::Codex, self::ApiKey] => 'On the OpenAI platform, open API keys and create a secret key.',
            default => throw SignInMethodMissing::for($program->value, $this->value),
        };
    }
}
