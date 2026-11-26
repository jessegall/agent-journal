<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Text\ListTextSectionsPayload;
use App\Data\Pages\TextSections;
use App\Reads\Contracts\TextResolver;
use App\Reads\Values\PageSize;
use App\Records\Contracts\RecordResolver;
use App\Support\RecordReference;

/**
 * Answers a page of a text version's sections.
 */
final readonly class ListTextSectionsController
{
    public function __invoke(ListTextSectionsPayload $call, TextResolver $text, RecordResolver $records): TextSections
    {
        $target = $records->identify(RecordReference::parse($call->target));

        return $text->sections($target, $call->version, $call->afterSection, PageSize::from($call->perPage));
    }
}
