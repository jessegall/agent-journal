<?php

declare(strict_types=1);

namespace App\Connections\Values;

/**
 * One platform a published release ships for, as its manifest measured it: the bytes its files take, which are the
 * bytes downloaded and installed alike, whether every file was measured, the prerequisites the machine needs and the
 * local providers it runs.
 */
final readonly class ReleaseTarget
{
    /**
     * @param  list<string>  $prerequisites
     */
    public function __construct(
        public string $name,
        public int $bytes,
        public bool $isMeasured,
        public array $prerequisites,
    ) {}

    /**
     * Whether the platform may be advertised: every file measured and its prerequisites named.
     */
    public function isSupported(): bool
    {
        return $this->isMeasured && $this->prerequisites !== [];
    }
}
