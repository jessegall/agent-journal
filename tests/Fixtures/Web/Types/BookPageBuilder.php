<?php

declare(strict_types=1);

namespace Tests\Fixtures\Web\Types;

use App\Web\Creation\Contracts\PageBuilder;
use Illuminate\Http\Request;

final class BookPageBuilder implements PageBuilder
{
    private int $buildCount = 0;

    public function build(Request $visit): BookData
    {
        $this->buildCount++;

        return BookData::from(['title' => $visit->getPathInfo().' #'.$this->buildCount]);
    }
}
