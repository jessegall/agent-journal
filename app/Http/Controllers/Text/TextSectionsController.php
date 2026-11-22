<?php

declare(strict_types=1);

namespace App\Http\Controllers\Text;

use App\Contracts\Reads\TextResolver;
use App\Contracts\Records\RecordResolver;
use App\Http\Requests\Text\TextSectionsRequest;
use Illuminate\Http\JsonResponse;

/**
 * A page of the sections of one version of a record's text.
 */
final readonly class TextSectionsController
{
    public function __invoke(TextSectionsRequest $request, TextResolver $text, RecordResolver $records): JsonResponse
    {
        return new JsonResponse(
            $text->sections(
                $request->target($records),
                $request->version(),
                $request->afterSection(),
                $request->pageSize(),
            ),
        );
    }
}
