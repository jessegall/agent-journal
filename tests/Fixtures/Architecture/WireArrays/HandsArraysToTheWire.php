<?php

declare(strict_types=1);

namespace Tests\Fixtures\Architecture\WireArrays;

use App\Mcp\Data\ToolResult;
use Illuminate\Http\JsonResponse;
use Spatie\LaravelData\Data;

/**
 * A response and a tool result each turned into an array by hand, beside the same two handed their Data.
 */
final class HandsArraysToTheWire
{
    public function response(Data $answer): JsonResponse
    {
        return new JsonResponse($answer->toArray());
    }

    public function result(Data $answer): ToolResult
    {
        return ToolResult::ok($answer->toArray());
    }

    public function handedResponse(Data $answer): JsonResponse
    {
        return new JsonResponse($answer);
    }

    public function handedResult(Data $answer): ToolResult
    {
        return ToolResult::ok($answer);
    }
}
