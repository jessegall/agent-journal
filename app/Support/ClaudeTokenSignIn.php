<?php

declare(strict_types=1);

namespace App\Support;

/**
 * Claude Code signed in by a long-lived provider token (`claude setup-token`): the token's file is opened for the
 * driver on its own descriptor, named by CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR, and the status says oauth_token.
 */
final readonly class ClaudeTokenSignIn extends ClaudeSecretSignIn
{
    /**
     * The descriptor the token's file is opened on, the first after standard input, output and error.
     */
    public const int TOKEN_DESCRIPTOR = 3;

    /**
     * The file in an account folder that holds its provider token.
     */
    public static function tokenFileIn(string $directory): string
    {
        return $directory.'/provider-token';
    }

    protected function secretFile(string $directory): string
    {
        return self::tokenFileIn($directory);
    }

    protected function authMethod(): string
    {
        return 'oauth_token';
    }

    protected function install(string $directory): void {}

    protected function uninstall(string $directory): void {}

    protected function variables(string $directory): array
    {
        return ['CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR' => (string) self::TOKEN_DESCRIPTOR];
    }

    protected function readFiles(string $directory): array
    {
        return [self::TOKEN_DESCRIPTOR => $this->secretFile($directory)];
    }
}
