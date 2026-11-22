<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers;

use App\Communication\Resolvers\ChatTimeline;
use Domain\Chat\Data\ChatEventsInput;
use Domain\Chat\Data\ChatEventsPageData;
use Illuminate\Http\JsonResponse;

final readonly class ChatEventsController
{
    /**
     * A chat's events after the window's cursor, a fresh snapshot without one, or that the reader's access ended.
     */
    public function __invoke(ChatEventsInput $input, ChatTimeline $timeline): JsonResponse
    {
        $page = $input->cursor === null
            ? $timeline->snapshot($input->inboxId)
            : $timeline->after($input->inboxId, $input->cursor);

        return new JsonResponse(ChatEventsPageData::from($page), headers: ['Cache-Control' => 'no-store']);
    }
}
