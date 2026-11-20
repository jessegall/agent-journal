<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp;

use App\Agents\Contracts\ReadGrant;
use App\Agents\Values\ReadRequest;
use App\Mcp\Contracts\JobPermissionReader;
use App\Mcp\Exceptions\ToolArgumentInvalid;
use App\Mcp\Support\ToolArguments;
use App\Operations\Enums\ResourceAreaType;
use Domain\Documents\Contracts\DocumentReader;
use Domain\Documents\Resolvers\DocumentPages;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\MimeType;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Contracts\HasUriTemplate;
use Laravel\Mcp\Support\UriTemplate;

#[Name('document_revision')]
#[MimeType('text/markdown')]
#[Description('The Markdown of one published document revision.')]
final class DocumentRevisionResource extends PublicationResource implements HasUriTemplate
{
    public function __construct(private readonly DocumentReader $documents, private readonly ReadGrant $reads) {}

    public function uriTemplate(): UriTemplate
    {
        return new UriTemplate('journal://v1/docs/{id}/revisions/{revision}');
    }

    public function shouldRegister(JobPermissionReader $permissions, ReadDocumentTool $reader): bool
    {
        return $permissions->allows($reader);
    }

    protected function read(Request $request): Response
    {
        $arguments = ToolArguments::read($this->name(), $request, ['id', 'revision']);
        $id = $arguments->recordReference('id');
        $revision = $arguments->recordReference('revision');
        if (! is_int($revision)) {
            throw ToolArgumentInvalid::for('revision', 'a positive revision number');
        }

        $this->reads->assertAllowed(new ReadRequest(DocumentPages::TOOL, ResourceAreaType::JournalContent));

        return $this->markdown($this->documents->document($id, $this->bodyArguments(DocumentPages::TOOL, $revision)));
    }
}
