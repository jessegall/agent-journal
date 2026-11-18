<?php

declare(strict_types=1);

namespace Domain\Memory\Http\Controllers;

use Domain\Memory\Contracts\MemoryReader;
use Domain\Memory\Http\Requests\ListMemoriesRequest;
use Illuminate\Http\JsonResponse;

/**
 * Answers one page of the caller's own memories, heaviest first.
 */
final readonly class ListMemoriesController
{
    public function __invoke(ListMemoriesRequest $request, MemoryReader $memories): JsonResponse
    {
        $page = $memories->own($request->page());

        return new JsonResponse([
            'memories' => array_map(fn ($card): array => ['id' => $card->id, 'number' => $card->number, 'text' => $card->text, 'weight' => $card->weight], $page->cards),
            'page' => $page->page,
            'perPage' => $page->perPage,
            'total' => $page->total,
        ]);
    }
}
