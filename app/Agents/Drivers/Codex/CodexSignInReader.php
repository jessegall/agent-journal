<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Codex;

use App\Accounts\Enums\SignInMethod;
use App\Agents\Drivers\Setup\Contracts\SignInReader;
use App\Agents\Values\SignInFolder;
use App\Agents\Values\SignInReport;

/**
 * Reads `codex login status`: signed in when it names a sign-in for a folder that keeps its own; the method is told by
 * the words the status starts with, and only once the command ended well.
 */
final readonly class CodexSignInReader implements SignInReader
{
    /**
     * What the status prints for a signed-in home, whatever the method.
     */
    private const string SIGNED_IN = 'Logged in using';

    /**
     * The words the status starts with for each method the journal accepts.
     */
    private const array METHODS = [
        'Logged in using ChatGPT' => SignInMethod::OAuth,
        'API key configured' => SignInMethod::ApiKey,
    ];

    public function __invoke(string $printed, int|null $exitCode, SignInFolder $folder): SignInReport
    {
        $isReadable = $exitCode === null || in_array($exitCode, [0, 1], true);
        $method = $exitCode === 0 && $folder->holdsSignIn ? $this->methodOf(trim($printed)) : null;

        $isSignedIn = $exitCode === null
            ? str_contains($printed, self::SIGNED_IN) && $folder->holdsSignIn
            : $method !== null;

        return new SignInReport($isReadable, $isSignedIn, $method);
    }

    private function methodOf(string $printed): SignInMethod|null
    {
        foreach (self::METHODS as $words => $method) {
            if (str_starts_with($printed, $words)) {
                return $method;
            }
        }

        return null;
    }
}
