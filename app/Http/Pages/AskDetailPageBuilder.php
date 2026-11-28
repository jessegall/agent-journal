<?php

declare(strict_types=1);

namespace App\Http\Pages;

use App\Asks\Contracts\AskReader;
use App\Asks\Data\AskDetail;
use App\Http\Requests\AskPageRequest;
use App\Reads\PageFormRequests;
use App\Web\Creation\Contracts\PageBuilder;
use Illuminate\Http\Request;

/**
 * One ask's own page, where a notification leads: it shows the ask and answers nothing.
 */
final readonly class AskDetailPageBuilder implements PageBuilder
{
    public function __construct(private PageFormRequests $requests, private AskReader $asks) {}

    public function build(Request $visit): AskDetail
    {
        $input = $this->requests->from(AskPageRequest::class, $visit);

        return $this->asks->detail($input->ask());
    }
}
