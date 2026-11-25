<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Accounts\AccountFolders;
use App\Contracts\Files\Files;
use App\Enums\Files\Permissions;
use App\Enums\Files\Place;
use App\Values\Depth;

/**
 * The sign-in service makes and removes its account folders itself, on the protected host where it runs as the
 * folder's owner.
 */
final readonly class LocalAccountFolders implements AccountFolders
{
    public function __construct(private Files $files) {}

    public function make(string $directory): void
    {
        $this->files->makeFolder($this->files->pathIn(Place::Accounts, $directory), Permissions::OwnerOnly);
    }

    public function remove(string $directory): void
    {
        $folder = $this->files->pathIn(Place::Accounts, $directory);

        if (! $this->files->isLink($folder) && $this->files->isFolder($folder)) {
            $this->files->deleteFolder($folder, Depth::levels(Depth::LEVEL_LIMIT));
        }
    }
}
