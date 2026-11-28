<?php

declare(strict_types=1);

namespace App\Http\Pages;

use App\Asks\Contracts\AskReader;
use App\Asks\Data\AskInbox;
use App\Web\Creation\Contracts\PageBuilder;
use Illuminate\Http\Request;

final readonly class AskInboxPageBuilder implements PageBuilder
{
    public function __construct(private AskReader $asks) {}

    public function build(Request $visit): AskInbox
    {
        return $this->asks->inbox();
    }
}
