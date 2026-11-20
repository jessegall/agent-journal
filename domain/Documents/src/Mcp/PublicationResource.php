<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp;

use App\Mcp\Data\NextAction;
use App\Mcp\Data\ToolResult;
use App\Mcp\Resources\JournalResource;
use App\Mcp\Support\ToolArguments;
use Domain\Documents\Enums\PublicationView;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;

abstract class PublicationResource extends JournalResource
{
    protected function bodyArguments(string $tool, int|null $revision = null): ToolArguments
    {
        $arguments = ['view' => PublicationView::Body->value];
        if ($revision !== null) {
            $arguments['revision'] = $revision;
        }

        return ToolArguments::read($tool, new Request($arguments), array_keys($arguments));
    }

    protected function markdown(ToolResult $page): Response
    {
        $response = Response::text($page->responseFields['body']);
        if ($page->nextActions === []) {
            return $response;
        }

        return $response->withMeta('next_actions', array_map(
            fn (NextAction $action): array => $action->structuredContent(),
            $page->nextActions,
        ));
    }
}
