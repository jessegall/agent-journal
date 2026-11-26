<?php

declare(strict_types=1);

namespace App\Sessions;

/**
 * A folder the host writes inside a start's isolated settings folder before it spawns the driver, and the arguments
 * it puts right before that folder's absolute path.
 */
final readonly class StartFolder
{
    /**
     * @param  list<StartFile>  $files
     * @param  list<string>  $arguments
     */
    public function __construct(
        public string $name,
        public array $files,
        public array $arguments,
    ) {}

    /**
     * @return array{name: string, files: list<array{path: string, content: string}>, arguments: list<string>}
     */
    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'files' => array_map(fn (StartFile $file) => $file->toArray(), $this->files),
            'arguments' => $this->arguments,
        ];
    }
}
