<?php

declare(strict_types=1);

namespace App\Profiles\Values;

/**
 * What `claude auth status --json` said about an account folder, the parts the journal reads and nothing else: whether
 * it answered at all, whether it is logged in and by which method, the folder it read, the email it shows and when
 * its login expires, as the ISO 8601 time it printed.
 */
final readonly class ClaudeStatus
{
    public function __construct(
        public bool $isReadable,
        public bool $isLoggedIn,
        public string|null $authMethod,
        public string|null $configDirectory,
        public string|null $email,
        public string|null $expiresAt,
    ) {}

    public static function fromJson(string $output): self
    {
        $decoded = json_decode($output, true);
        $report = is_array($decoded) ? $decoded : [];
        $text = fn (string $key) => is_string($report[$key] ?? null) ? $report[$key] : null;

        return new self(
            is_array($decoded),
            ($report['loggedIn'] ?? false) === true,
            $text('authMethod'),
            $text('configDirectory'),
            $text('email'),
            $text('loginExpiresAt'),
        );
    }

    /**
     * Whether it is logged in by this method in exactly this folder.
     */
    public function isSignedInBy(string $authMethod, string $directory): bool
    {
        return $this->isLoggedIn && $this->authMethod === $authMethod && $this->reads($directory);
    }

    /**
     * Whether the folder it read is the attempted one, the same path or, when both exist, the same real folder behind
     * a trailing slash or a symbolic link.
     */
    private function reads(string $directory): bool
    {
        if ($this->configDirectory === null) {
            return false;
        }

        if (rtrim($this->configDirectory, '/') === rtrim($directory, '/')) {
            return true;
        }

        $real = realpath($this->configDirectory);

        return $real !== false && $real === realpath($directory);
    }
}
