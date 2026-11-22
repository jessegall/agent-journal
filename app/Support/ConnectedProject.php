<?php

declare(strict_types=1);

namespace App\Support;

/**
 * The project a connected folder's request serves: its key, the canonical root its work may run in and the
 * environment of the binding it came through, none for a binding without one.
 */
final readonly class ConnectedProject
{
    public function __construct(public string $key, public string $root, public string|null $environmentId = null) {}

    /**
     * Whether the folder is the root or lies below it.
     */
    public function contains(string $folder): bool
    {
        $root = rtrim($this->root, '/');

        return $folder === $root || str_starts_with($folder, $root.'/');
    }
}
