<?php

declare(strict_types=1);

namespace App\Agents\Values;

use App\Hosts\Protocol\Payloads\HostPlanFilePayload;

/**
 * One file a process plan hands its process, such as a driver's settings: a plain name in the process's own files
 * folder, and its whole content.
 */
final readonly class PlanFile
{
    public function __construct(
        public string $name,
        public string $content,
        // A file the journal generated, whose {folder:...} and {host:...} placeholders the host fills before writing it.
        public bool $isTemplate = false,
        // A file only the driver program may read, never the commands its model runs, such as a seal's key.
        public bool $isProgramOnly = false,
    ) {}

    /**
     * A file only the driver program may read, such as the key that seals its offline hook replies.
     */
    public static function programOnly(string $name, string $content): self
    {
        return new self($name, $content, isProgramOnly: true);
    }

    /**
     * A file the journal generated for the start, such as a settings file, which names the start's folders and the
     * host's executables by their placeholders.
     */
    public static function template(string $name, string $content): self
    {
        return new self($name, $content, true);
    }

    /**
     * The file as a plan carries it.
     */
    public function protocolData(): HostPlanFilePayload
    {
        return HostPlanFilePayload::from([
            'name' => $this->name,
            'content' => $this->content,
            'template' => $this->isTemplate,
        ]);
    }
}
