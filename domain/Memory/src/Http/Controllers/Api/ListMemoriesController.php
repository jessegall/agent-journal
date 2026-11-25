<?php

declare(strict_types=1);

namespace Domain\Memory\Http\Controllers\Api;

use Domain\Memory\Api\ListMemoriesPayload;
use Domain\Memory\Api\MemoryPage;
use Domain\Memory\Contracts\MemoryResolver;

/**
 * Answers one page of the caller's memories.
 */
final readonly class ListMemoriesController
{
    public function __invoke(ListMemoriesPayload $call, MemoryResolver $memories): MemoryPage
    {
        $page = $memories->own($call->page);

        return MemoryPage::from([
            'memories' => array_map(fn ($card) => [
                'id' => $card->id,
                'number' => $card->number,
                'text' => $card->text,
                'weight' => $card->weight,
                'revision' => $card->revision,
            ], $page->cards),
            'page' => $page->page,
            'perPage' => $page->perPage,
            'total' => $page->total,
        ]);
    }
}
