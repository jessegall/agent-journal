<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Text\ListTextSectionsCall;
use App\Contracts\RecordResolver;
use App\Contracts\TextResolver;
use App\Data\TextSections;
use App\Support\RecordReference;
use App\Values\PageSize;

/**
 * Answers a page of a text version's sections.
 */
final readonly class ListTextSectionsController
{
    public function __invoke(ListTextSectionsCall $call, TextResolver $text, RecordResolver $records): TextSections
    {
        $target = $records->identify(RecordReference::parse($call->target));

        return $text->sections($target, $call->version, $call->afterSection, PageSize::from($call->perPage));
    }
}
