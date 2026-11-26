<?php

declare(strict_types=1);

namespace App\Agents\Values;

use JsonSerializable;

/**
 * One file a process plan hands its process, such as a driver's settings: a plain name in the process's own files
 * folder, and its whole content.
 */
final readonly class PlanFile implements JsonSerializable
{
    public function __construct(
        public string $name,
        public string $content,
        // A file the journal generated, whose {folder:...} and {host:...} placeholders the host fills before writing it.
        public bool $isTemplate = false,
    ) {}

    /**
     * A file the journal generated for the start, such as a settings file, which names the start's folders and the
     * host's programs by their placeholders.
     */
    public static function template(string $name, string $content): self
    {
        return new self($name, $content, true);
    }

    /**
     * @return array{name: string, content: string, template: bool}
     */
    public function jsonSerialize(): array
    {
        return [
            'name' => $this->name,
            'content' => $this->content,
            'template' => $this->isTemplate,
        ];
    }
}
