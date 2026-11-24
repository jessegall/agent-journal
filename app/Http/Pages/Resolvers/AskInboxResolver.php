<?php

declare(strict_types=1);

namespace App\Http\Pages\Resolvers;

use App\Contracts\Asks\AskReader;
use App\Contracts\Navigation\PageResolver;
use App\Data\Asks\AskInbox;

final readonly class AskInboxResolver implements PageResolver
{
    public function __construct(private AskReader $asks) {}

    public function read(): AskInbox
    {
        return $this->asks->inbox();
    }
}
