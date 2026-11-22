<?php

declare(strict_types=1);

namespace App\Http\Controllers\Text;

use App\Contracts\RecordResolver;
use App\Contracts\TextResolver;
use App\Http\Requests\Text\ReadTextRequest;
use Illuminate\Http\JsonResponse;

/**
 * A bounded part of one version of a record's text.
 */
final readonly class ReadTextController
{
    public function __invoke(ReadTextRequest $request, TextResolver $text, RecordResolver $records): JsonResponse
    {
        return new JsonResponse($text->read($request->target($records), $request->version(), $request->selection()));
    }
}
