<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp\Resources;

use App\Mcp\Data\NextAction;
use App\Mcp\Data\ToolResult;
use App\Mcp\Resources\JournalResource;
use App\Mcp\Support\ToolArguments;
use Domain\Documents\Enums\PublicationView;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;

abstract class PublicationResource extends JournalResource
{
    /**
     * The URI template's fields, without the query a continued read adds to the last of them.
     *
     * @param  list<string>  $fields
     */
    protected function pathArguments(Request $request, array $fields): ToolArguments
    {
        $values = array_map(fn (mixed $value) => is_string($value) ? strtok($value, '?') : $value, $request->all());

        return ToolArguments::read($this->name(), new Request($values), $fields);
    }

    /**
     * The body read's arguments, with the continuation the resource's URI carries for a later part.
     */
    protected function bodyArguments(Request $request, string $tool, int|null $revision = null): ToolArguments
    {
        $continuation = ToolArguments::query($this->name(), $request, ['continuation'])->continuation();

        $arguments = match (true) {
            $continuation !== null => ['continuation' => $continuation],
            $revision !== null => [
                'view' => PublicationView::Body->value,
                'revision' => $revision,
            ],
            default => ['view' => PublicationView::Body->value],
        };

        return ToolArguments::read($tool, new Request($arguments), array_keys($arguments));
    }

    /**
     * The body part as Markdown, with the line break it ends on; when more follows, a closing line names the URI
     * that reads the next part.
     */
    protected function markdown(ToolResult $page, Request $request): Response
    {
        $body = $page->responseFields['body'];

        if ($page->nextActions === []) {
            return Response::text($body);
        }

        $body .= $page->responseFields['ends_line'] ? "\n" : '';
        $path = strtok((string) $request->uri(), '?');
        $next = $path.'?continuation='.rawurlencode($page->nextActions[0]->arguments['continuation']);

        return Response::text($body."\n\n(This is one part of the text. Read the next part at {$next})")
            ->withMeta('next_actions', array_map(
                fn (NextAction $action) => $action->structuredContent(),
                $page->nextActions,
            ));
    }
}
