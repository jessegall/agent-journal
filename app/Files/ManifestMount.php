<?php

declare(strict_types=1);

namespace App\Files;

use App\Hosts\Protocol\HostMountType;
use App\Hosts\Protocol\Payloads\HostContainerMountPayload;

/**
 * One folder a helper container sees: what it comes from (nothing for the whole plan-file folder), where it appears
 * and whether it may be written.
 */
final readonly class ManifestMount
{
    private function __construct(
        public HostMountType $type,
        public string|null $source,
        public string $target,
        public bool $isWritable,
        // A volume the host must find, never make: the history of a conversation being resumed.
        public bool $mustExist = false,
        // A writer's own clone: the host clones the source into the session's checkout volume and mounts that.
        public bool $isCheckout = false,
    ) {}

    public function protocolData(): HostContainerMountPayload
    {
        return HostContainerMountPayload::from(get_object_vars($this));
    }

    /**
     * A folder of the machine the host runs on, the one mount of a local helper.
     */
    public static function bind(string $source, string $target, bool $isWritable): self
    {
        return new self(HostMountType::Bind, $source, $target, $isWritable);
    }

    /**
     * A named volume of the agent daemon.
     */
    public static function volume(string $name, string $target, bool $isWritable): self
    {
        return new self(HostMountType::Volume, $name, $target, $isWritable);
    }

    /**
     * A named volume that must already exist on the agent daemon, such as a resumed conversation's history.
     */
    public static function existingVolume(string $name, string $target, bool $isWritable): self
    {
        return new self(HostMountType::Volume, $name, $target, $isWritable, true);
    }

    /**
     * A writer's own clone of the workspace mount, read-write: the host clones the workspace into the session's
     * checkout volume (<installation>-checkout-<session>) before the container and mounts that at the same target.
     */
    public static function checkoutOf(self $workspace): self
    {
        return new self($workspace->type, $workspace->source, $workspace->target, true, false, true);
    }

    /**
     * A folder under /srv/journal/ on the agent daemon.
     */
    public static function daemonBind(string $source, string $target, bool $isWritable): self
    {
        return new self(HostMountType::DaemonBind, $source, $target, $isWritable);
    }

    /**
     * One file of the start's plan, read-only, which the host writes beside the session's other plan files.
     */
    public static function planFile(string $name, string $target): self
    {
        return new self(HostMountType::PlanFile, $name, $target, false);
    }

    /**
     * Every file of the start's plan, read-only, in the one folder that holds them.
     */
    public static function planFiles(string $target): self
    {
        return new self(HostMountType::PlanFile, null, $target, false);
    }

    /**
     * A writable folder in the container's memory, gone with the container, where a driver keeps its own scratch.
     */
    public static function scratch(string $target): self
    {
        return new self(HostMountType::Scratch, null, $target, true);
    }
}
