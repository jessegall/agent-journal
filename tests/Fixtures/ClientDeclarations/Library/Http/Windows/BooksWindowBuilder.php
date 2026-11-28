<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations\Library\Http\Windows;

use App\Web\Creation\Contracts\WindowBuilder;
use Illuminate\Http\Request;
use Tests\Fixtures\ClientDeclarations\Library\BooksPaneData;

final readonly class BooksWindowBuilder implements WindowBuilder
{
    public function build(Request $visit): BooksPaneData
    {
        return BooksPaneData::build()->titles(['Book previews'])->finish();
    }
}
