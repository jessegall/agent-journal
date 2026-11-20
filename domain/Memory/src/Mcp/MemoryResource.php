<?php

declare(strict_types=1);

namespace Domain\Memory\Mcp;

use App\Agents\Contracts\ReadGrant;
use App\Agents\Values\ReadRequest;
use App\Mcp\Contracts\JobPermissionReader;
use App\Mcp\Resources\JournalResource;
use App\Mcp\Support\ToolArguments;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\MimeType;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Contracts\HasUriTemplate;
use Laravel\Mcp\Support\UriTemplate;

#[Name('memory')]
#[MimeType('application/json')]
#[Description('One of your memories, with the same fields and continuation as memories_read.')]
final class MemoryResource extends JournalResource implements HasUriTemplate
{
    public function __construct(private readonly MemoryReadResult $memories, private readonly ReadGrant $reads) {}

    public function shouldRegister(JobPermissionReader $permissions, MemoryReadTool $tool): bool
    {
        return $permissions->allows($tool);
    }

    public function uriTemplate(): UriTemplate
    {
        return new UriTemplate('journal://v1/memories/{id}');
    }

    protected function read(Request $request): Response
    {
        $id = ToolArguments::uriId($request);
        $arguments = ToolArguments::query($this->name(), $request, ['continuation']);
        $this->reads->assertAllowed(new ReadRequest(
            MemoryReadResult::TOOL,
            arguments: ['memory_id' => $id],
        ));

        return Response::text(json_encode(
            $this->memories->read($id, $arguments->continuation())->structuredContent(),
            JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE,
        ));
    }
}
