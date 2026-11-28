<?php

declare(strict_types=1);

namespace App\Http\Pages;

use App\Http\Pages\Profiles\ProfilesIndex;
use App\Http\Pages\Profiles\ProfilesShow;
use App\Http\Requests\Profiles\ProfilePageRequest;
use App\Reads\PageFormRequests;
use App\Support\Layout\DeclaredLayoutData;
use App\Web\Creation\Contracts\PageBuilder;
use Illuminate\Http\Request;

/**
 * One profile's read-only reader, named by its key, beside the profiles list.
 */
final readonly class ProfilePageBuilder implements PageBuilder
{
    public function __construct(
        private PageFormRequests $requests,
        private ProfilesIndex $index,
        private ProfilesShow $reader,
    ) {}

    public function build(Request $visit): ProfilePageData
    {
        return ProfilePageData::build()->shown($this->content($visit))->finish();
    }

    private function content(Request $visit): DeclaredLayoutData
    {
        $input = $this->requests->forVisit(ProfilePageRequest::class, $visit);

        $key = $input->key();

        return $this->index->of($key->key, [$this->reader->part($key)]);
    }
}
