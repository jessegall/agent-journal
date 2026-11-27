<?php

declare(strict_types=1);

namespace App\Files;

use App\Agents\Exceptions\ManifestRefused;
use App\Hosts\Protocol\HostMountType;
use App\Hosts\Protocol\Payloads\HostContainerMountPayload;

/**
 * One folder a container sees: what it comes from, where it appears and whether it may be written. A plan file mount
 * names a file of the start's plan, or the whole folder of them, until the start is placed on its host and it becomes
 * a bind of the folder the plan files are written to.
 */
final readonly class ManifestMount
{
    private function __construct(
        public HostMountType $type,
        public string|null $source,
        public string $target,
        public bool $isWritable,
        public bool $isPlanFile = false,
    ) {}

    /**
     * The mount as the host reads it; a plan file mount is placed first.
     *
     * @throws ManifestRefused
     */
    public function protocolData(): HostContainerMountPayload
    {
        if ($this->isPlanFile) {
            throw ManifestRefused::because("the plan file mount at {$this->target} was never placed on its host");
        }

        return HostContainerMountPayload::from([
            'type' => $this->type,
            'source' => $this->source,
            'target' => $this->target,
            'isWritable' => $this->isWritable,
        ]);
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
     * A folder under the agent daemon's data folder.
     */
    public static function daemonBind(string $source, string $target, bool $isWritable): self
    {
        return new self(HostMountType::DaemonBind, $source, $target, $isWritable);
    }

    /**
     * One file of the start's plan, read-only, at the target.
     */
    public static function planFile(string $name, string $target): self
    {
        return new self(HostMountType::DaemonBind, $name, $target, false, true);
    }

    /**
     * Every file of the start's plan, read-only, in the one folder that holds them.
     */
    public static function planFiles(string $target): self
    {
        return new self(HostMountType::DaemonBind, null, $target, false, true);
    }

    /**
     * A writable folder in the container's memory, gone with the container, where a driver keeps its own scratch.
     */
    public static function scratch(string $target): self
    {
        return new self(HostMountType::Scratch, null, $target, true);
    }

    /**
     * The same source seen read-only at another target, as a helper reads a workspace it checks or clones from.
     */
    public function readOnlyAt(string $target): self
    {
        return new self($this->type, $this->source, $target, false, $this->isPlanFile);
    }

    /**
     * The plan file mount as a read-only bind of the folder its process's plan files are written to.
     */
    public function placedIn(string $filesFolder): self
    {
        if (! $this->isPlanFile) {
            return $this;
        }

        $source = $this->source === null ? $filesFolder : "{$filesFolder}/{$this->source}";

        return self::daemonBind($source, $this->target, false);
    }
}
