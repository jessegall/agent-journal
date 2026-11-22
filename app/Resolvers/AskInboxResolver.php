<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Contracts\Chat\AskReader;
use App\Contracts\Navigation\PageResolver;
use App\Data\AskInbox;

final readonly class AskInboxResolver implements PageResolver
{
    public function __construct(private AskReader $asks) {}

    public function read(): AskInbox
    {
        return $this->asks->inbox();
    }
}
