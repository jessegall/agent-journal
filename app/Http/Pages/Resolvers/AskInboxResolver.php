<?php

declare(strict_types=1);

namespace App\Http\Pages\Resolvers;

use App\Asks\Contracts\AskReader;
use App\Asks\Data\AskInbox;
use App\Navigation\Contracts\PageResolver;

final readonly class AskInboxResolver implements PageResolver
{
    public function __construct(private AskReader $asks) {}

    public function read(): AskInbox
    {
        return $this->asks->inbox();
    }
}
