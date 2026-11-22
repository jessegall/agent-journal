<?php

declare(strict_types=1);

namespace App\Profiles\Resolvers;

use App\Profiles\Support\ProfileIndexLayout;
use App\Ui\Contracts\PageResolver;
use App\Ui\Layout\DeclaredLayoutData;

/**
 * The profiles the owner may read, by key, on the shared list recipe, with Nothing selected in its reader.
 */
final readonly class ProfilesWindowResolver implements PageResolver
{
    public function __construct(private ProfileIndexLayout $index) {}

    public function read(): DeclaredLayoutData
    {
        return $this->index->of('', []);
    }
}
