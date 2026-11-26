<?php

declare(strict_types=1);

namespace App\Http\Pages\Resolvers;

use App\Http\Pages\Profiles\ProfilesIndex;
use App\Http\Pages\Profiles\ProfilesShow;
use App\Http\Requests\Profiles\ProfilePageRequest;
use App\Navigation\Contracts\PageResolver;
use App\Support\Layout\DeclaredLayoutData;

/**
 * One profile's read-only reader, named by its key, beside the profiles list.
 */
final readonly class ProfileWindowResolver implements PageResolver
{
    public function __construct(
        private ProfilePageRequest $request,
        private ProfilesIndex $index,
        private ProfilesShow $reader,
    ) {}

    public function read(): DeclaredLayoutData
    {
        $key = $this->request->key();

        return $this->index->of($key->key, [$this->reader->part($key)]);
    }
}
