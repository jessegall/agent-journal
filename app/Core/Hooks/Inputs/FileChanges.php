<?php

declare(strict_types=1);

namespace App\Core\Hooks\Inputs;

/**
 * The files one edit changes, in the order the program changes them.
 */
final readonly class FileChanges
{
    /**
     * @param  list<FileChange>  $changes
     */
    public function __construct(public array $changes) {}

    /**
     * @return list<string>
     */
    public function paths(): array
    {
        return array_map(fn (FileChange $change) => $change->path, $this->changes);
    }
}
