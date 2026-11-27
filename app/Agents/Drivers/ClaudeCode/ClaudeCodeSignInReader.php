<?php

declare(strict_types=1);

namespace App\Agents\Drivers\ClaudeCode;

use App\Accounts\Data\ClaudeStatusData;
use App\Accounts\Enums\SignInMethod;
use App\Agents\Drivers\Setup\Contracts\SignInReader;
use App\Agents\Values\SignInFolder;
use App\Agents\Values\SignInReport;
use JsonException;
use Spatie\LaravelData\Exceptions\CannotCreateData;
use TypeError;

/**
 * Reads `claude auth status --json`: signed in when it is logged in, in this folder, by a method the journal accepts.
 */
final readonly class ClaudeCodeSignInReader implements SignInReader
{
    /**
     * The sign-in methods the journal accepts, by the names Claude Code's auth status gives them.
     */
    private const array METHODS = [
        'claude.ai' => SignInMethod::OAuth,
        'oauth_token' => SignInMethod::ProviderToken,
        'api_key_helper' => SignInMethod::ApiKey,
    ];

    public function __invoke(string $printed, int|null $exitCode, SignInFolder $folder): SignInReport
    {
        try {
            $status = ClaudeStatusData::from(json_decode($printed, true, 512, JSON_THROW_ON_ERROR));
        } catch (JsonException|CannotCreateData|TypeError) {
            return SignInReport::unreadable();
        }

        $method = self::METHODS[(string) $status->authMethod] ?? null;
        $isInFolder = $status->configDirectory !== null && $folder->isReportedAs($status->configDirectory);
        $isSignedIn = $status->isLoggedIn && $method !== null && $isInFolder;

        return new SignInReport(
            true,
            $isSignedIn,
            $isSignedIn ? $method : null,
            $status->email,
            $status->loginExpiresAt,
            $status->organization,
        );
    }
}
