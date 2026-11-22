<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Contracts\AskReader;
use App\Contracts\PageResolver;
use App\Data\AskDetail;
use App\Http\Requests\AskPageRequest;

/**
 * One ask's own page, where a notification leads: it shows the ask and answers nothing.
 */
final readonly class AskDetailResolver implements PageResolver
{
    public function __construct(private AskPageRequest $request, private AskReader $asks) {}

    public function read(): AskDetail
    {
        return $this->asks->detail($this->request->ask());
    }
}
