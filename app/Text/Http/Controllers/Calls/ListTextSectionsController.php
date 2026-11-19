<?php

declare(strict_types=1);

namespace App\Text\Http\Controllers\Calls;

use App\Numbers\Support\RecordReference;
use App\Reads\Values\PageSize;
use App\Records\Contracts\RecordResolver;
use App\Text\Calls\ListTextSectionsCall;
use App\Text\Contracts\TextResolver;
use App\Text\Data\TextSections;

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
