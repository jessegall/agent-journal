<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations;

use App\Web\Creation\Contracts\PageBuilder;
use Illuminate\Http\Request;

final readonly class RecentNotesPageBuilder implements PageBuilder
{
    public function build(Request $visit): RecentNotesData
    {
        return RecentNotesData::build()->titles([])->finish();
    }
}
