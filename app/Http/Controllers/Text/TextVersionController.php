<?php

declare(strict_types=1);

namespace App\Http\Controllers\Text;

use App\Http\Requests\Text\TextVersionRequest;
use App\Reads\Contracts\TextResolver;
use App\Records\Contracts\RecordResolver;
use Illuminate\Http\JsonResponse;

/**
 * The version of a record's text: its id, label and line count.
 */
final readonly class TextVersionController
{
    public function __invoke(TextVersionRequest $request, TextResolver $text, RecordResolver $records): JsonResponse
    {
        return new JsonResponse($text->version($request->target($records), $request->version()));
    }
}
