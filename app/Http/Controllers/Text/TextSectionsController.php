<?php

declare(strict_types=1);

namespace App\Http\Controllers\Text;

use App\Http\Requests\Text\TextSectionsRequest;
use App\Records\Contracts\RecordReader;
use App\Text\Contracts\TextReader;
use Illuminate\Http\JsonResponse;

/**
 * A page of the sections of one version of a record's text.
 */
final readonly class TextSectionsController
{
    public function __invoke(TextSectionsRequest $request, TextReader $text, RecordReader $records): JsonResponse
    {
        return new JsonResponse($text->sections($request->target($records), $request->version(), $request->afterSection(), $request->pageSize()));
    }
}
