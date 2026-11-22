<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Contracts\AskReader;
use App\Contracts\PageResolver;
use App\Data\AskInbox;

final readonly class AskInboxResolver implements PageResolver
{
    public function __construct(private AskReader $asks) {}

    public function read(): AskInbox
    {
        return $this->asks->inbox();
    }
}
