<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Files\Contracts\Files;
use App\Files\Enums\Permissions;
use App\Files\Enums\Place;
use App\Files\Values\Depth;
use App\Profiles\Contracts\AccountFolders;

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
