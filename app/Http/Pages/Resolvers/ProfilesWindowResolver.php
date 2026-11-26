<?php

declare(strict_types=1);

namespace App\Http\Pages\Resolvers;

use App\Http\Pages\Profiles\ProfilesIndex;
use App\Navigation\Contracts\PageResolver;
use App\Support\Layout\DeclaredLayoutData;

/**
 * The profiles the owner may read, by key, on the shared list recipe, with Nothing selected in its reader.
 */
final readonly class ProfilesWindowResolver implements PageResolver
{
    public function __construct(private ProfilesIndex $index) {}

    public function read(): DeclaredLayoutData
    {
        return $this->index->of('', []);
    }
}
