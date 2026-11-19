<?php

declare(strict_types=1);

namespace App\Agents\Support;

/**
 * One file the host writes in a start folder: its path inside the folder and its bytes.
 */
final readonly class StartFile
{
    public function __construct(
        public string $path,
        public string $content,
    ) {}

    /**
     * @return array{path: string, content: string}
     */
    public function toArray(): array
    {
        return ['path' => $this->path, 'content' => $this->content];
    }
}
