<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Profiles\Data\ClaudeStatusData;
use JsonException;
use Spatie\LaravelData\Exceptions\CannotCreateData;
use TypeError;

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
        try {
            $report = ClaudeStatusData::from(json_decode($output, true, 512, JSON_THROW_ON_ERROR));
        } catch (JsonException|CannotCreateData|TypeError) {
            return new self(false, false, null, null, null, null);
        }

        return new self(
            true,
            $report->loggedIn,
            $report->authMethod,
            $report->configDirectory,
            $report->email,
            $report->loginExpiresAt,
        );
    }

    /**
     * Whether it is logged in by this method in exactly this folder.
     */
    public function isSignedInBy(string $authMethod, string $directory, string $realDirectory): bool
    {
        return $this->isLoggedIn && $this->authMethod === $authMethod && $this->reads($directory, $realDirectory);
    }

    /**
     * Whether the folder it read is the attempted one: the same path, behind a trailing slash or not, or the folder's
     * real path, as the driver reports it after following a symbolic link.
     */
    private function reads(string $directory, string $realDirectory): bool
    {
        if ($this->configDirectory === null) {
            return false;
        }

        return in_array(rtrim($this->configDirectory, '/'), [rtrim($directory, '/'), $realDirectory], true);
    }
}
