<?php

declare(strict_types=1);

namespace App\Http\Pages;

use App\Http\Pages\Profiles\ProfilesIndex;
use App\Support\Layout\DeclaredLayoutData;
use App\Web\Creation\Contracts\PageBuilder;
use Illuminate\Http\Request;

/**
 * The profiles the owner may read, by key, on the shared list recipe, with Nothing selected in its reader.
 */
final readonly class ProfilesPageBuilder implements PageBuilder
{
    public function __construct(private ProfilesIndex $index) {}

    public function build(Request $visit): ProfilesPageData
    {
        return ProfilesPageData::build()->shown($this->content())->finish();
    }

    private function content(): DeclaredLayoutData
    {
        return $this->index->of('', []);
    }
}
