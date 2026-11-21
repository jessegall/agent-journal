<?php

declare(strict_types=1);

namespace App\Processes\Support;

/**
 * The project a connected folder's request serves: its key and the canonical root its work may run in.
 */
final readonly class ConnectedProject
{
    public function __construct(public string $key, public string $root) {}

    /**
     * Whether the folder is the root or lies below it.
     */
    public function contains(string $folder): bool
    {
        $root = rtrim($this->root, '/');

        return $folder === $root || str_starts_with($folder, $root.'/');
    }
}
