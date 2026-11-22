<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp\Resources;

use App\Contracts\Authorization\ReadGrant;
use App\Mcp\Contracts\JobPermissionReader;
use App\Mcp\Exceptions\ToolArgumentInvalid;
use App\Values\ReadRequest;
use Domain\Documents\Contracts\Documents\DocumentReader;
use Domain\Documents\Mcp\Tools\ReadDocumentTool;
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
        $arguments = $this->pathArguments($request, ['id', 'revision']);
        $id = $arguments->recordReference('id');
        $revision = $arguments->recordReference('revision');

        if (! is_int($revision)) {
            throw ToolArgumentInvalid::for('revision', 'a positive revision number');
        }

        $this->reads->assertAllowed(new ReadRequest(DocumentPages::TOOL));

        return $this->markdown(
            $this->documents->document($id, $this->bodyArguments($request, DocumentPages::TOOL, $revision)),
            $request,
        );
    }
}
