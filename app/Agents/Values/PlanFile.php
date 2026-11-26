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
    public function __construct(public string $name, public string $content) {}

    /**
     * @return array{name: string, content: string}
     */
    public function jsonSerialize(): array
    {
        return [
            'name' => $this->name,
            'content' => $this->content,
        ];
    }
}
