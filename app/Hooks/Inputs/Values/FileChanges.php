<?php

declare(strict_types=1);

namespace App\Hooks\Inputs\Values;

use App\Agents\Values\Operation;

/**
 * The files one edit changes, in the order the driver changes them.
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

    /**
     * Every change as an operation, so a policy judges the whole edit before any part of it runs.
     *
     * @return list<Operation>
     */
    public function operations(): array
    {
        return array_map(fn (FileChange $change): Operation => $change->asOperation(), $this->changes);
    }
}
