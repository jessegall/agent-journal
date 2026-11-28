<?php

declare(strict_types=1);

namespace Tests\Fixtures\Web\Types;

use App\Web\Creation\Contracts\WindowBuilder;
use Illuminate\Http\Request;

final class BookWindowBuilder implements WindowBuilder
{
    public function build(Request $visit): BookData
    {
        return BookData::from(['title' => $visit->getPathInfo()]);
    }
}
