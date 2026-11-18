<?php

declare(strict_types=1);

namespace App\Agents\Support;

/**
 * What other areas add to one launch as the host takes its grant: folders to write in its settings folder, with the
 * arguments that point the program at them.
 */
final class LaunchAdditions
{
    /**
     * @var list<LaunchFolder>
     */
    private array $folders = [];

    public function addFolder(LaunchFolder $folder): void
    {
        $this->folders[] = $folder;
    }

    /**
     * @return list<LaunchFolder>
     */
    public function folders(): array
    {
        return $this->folders;
    }
}
