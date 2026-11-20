<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Enums\MountType;

/**
 * One folder a helper container sees: what it comes from, where it appears and whether it may be written.
 */
final readonly class ManifestMount
{
    private function __construct(
        public MountType $type,
        public string $source,
        public string $target,
        public bool $writable,
    ) {}

    /**
     * A folder of the machine the host runs on, the one mount of a local helper.
     */
    public static function bind(string $source, string $target, bool $writable): self
    {
        return new self(MountType::Bind, $source, $target, $writable);
    }

    /**
     * A named volume of the agent daemon.
     */
    public static function volume(string $name, string $target, bool $writable): self
    {
        return new self(MountType::Volume, $name, $target, $writable);
    }

    /**
     * A folder under /srv/journal/ on the agent daemon.
     */
    public static function daemonBind(string $source, string $target, bool $writable): self
    {
        return new self(MountType::DaemonBind, $source, $target, $writable);
    }
}
