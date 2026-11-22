<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Contracts\PageResolver;
use App\Http\Requests\Profiles\ProfilePageRequest;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\ProfileIndexLayout;
use App\Support\ProfileReaderLayout;

/**
 * One profile's read-only reader, named by its key, beside the profiles list.
 */
final readonly class ProfileWindowResolver implements PageResolver
{
    public function __construct(
        private ProfilePageRequest $request,
        private ProfileIndexLayout $index,
        private ProfileReaderLayout $reader,
    ) {}

    public function read(): DeclaredLayoutData
    {
        $key = $this->request->key();

        return $this->index->of($key->key, [$this->reader->part($key)]);
    }
}
