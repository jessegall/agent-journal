<?php

declare(strict_types=1);

namespace Domain\Chat\Mcp;

use App\Agents\Support\ReadGrant;
use App\Agents\Values\ReadRequest;
use App\Mcp\Resources\JournalResource;
use App\Mcp\Support\ToolArguments;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\MimeType;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Contracts\HasUriTemplate;
use Laravel\Mcp\Support\UriTemplate;

#[Name('message')]
#[MimeType('application/json')]
#[Description('Read a message without marking it read or selecting it.')]
final class MessageResource extends JournalResource implements HasUriTemplate
{
    public function __construct(private readonly MessageReadResult $messages, private readonly ReadGrant $reads) {}

    public function uriTemplate(): UriTemplate
    {
        return new UriTemplate('journal://v1/messages/{id}');
    }

    protected function read(Request $request): Response
    {
        $id = ToolArguments::uriId($request);
        $view = ToolArguments::query($this->name(), $request, ['view', 'continuation']);
        $tool = MessageReadResult::TOOL;
        $this->reads->requireAllowed(new ReadRequest($tool, arguments: ['message_id' => $id]));

        return Response::text(json_encode(
            $this->messages->read($id, $view, $tool)->structuredContent(),
            JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE,
        ));
    }
}
