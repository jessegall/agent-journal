<?php

declare(strict_types=1);

namespace App\Values;

/**
 * One platform a published release ships for, as its manifest measured it: the bytes its files take, which are the
 * bytes downloaded and installed alike, whether every file was measured, the prerequisites the machine needs and the
 * local providers it runs.
 */
final readonly class ReleaseTarget
{
    /**
     * The local providers every advertised platform must run: Claude Code, while local Codex stays withheld until its
     * hook calls carry a per-thread capability (task 1913).
     */
    public const array REQUIRED_PROVIDERS = ['claude-code'];

    /**
     * @param  list<string>  $prerequisites
     * @param  list<string>  $providers
     */
    public function __construct(
        public string $name,
        public int $bytes,
        public bool $isMeasured,
        public array $prerequisites,
        public array $providers,
    ) {}

    /**
     * The required providers this platform does not run.
     *
     * @return list<string>
     */
    public function missingProviders(): array
    {
        return array_values(array_diff(self::REQUIRED_PROVIDERS, $this->providers));
    }

    /**
     * Whether the platform may be advertised: every file measured, its prerequisites named and every provider run.
     */
    public function isSupported(): bool
    {
        return $this->isMeasured && $this->prerequisites !== [] && $this->missingProviders() === [];
    }
}
