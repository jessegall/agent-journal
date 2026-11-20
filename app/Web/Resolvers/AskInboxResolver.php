<?php

declare(strict_types=1);

namespace App\Web\Resolvers;

use App\Supervision\Contracts\AskReader;
use App\Supervision\Data\AskInbox;
use App\Ui\Contracts\PageResolver;

final readonly class AskInboxResolver implements PageResolver
{
    public function __construct(private AskReader $asks) {}

    public function read(): AskInbox
    {
        return $this->asks->inbox();
    }
}
