<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp;

use App\Agents\Contracts\ReadGrant;
use App\Agents\Values\ReadRequest;
use App\Mcp\Contracts\JobPermissionReader;
use App\Mcp\Support\ToolArguments;
use App\Operations\Enums\ResourceAreaType;
use Domain\Documents\Contracts\ReportReader;
use Domain\Documents\Resolvers\ReportPages;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\MimeType;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Contracts\HasUriTemplate;
use Laravel\Mcp\Support\UriTemplate;

#[Name('report')]
#[MimeType('text/markdown')]
#[Description('The Markdown of a filed report.')]
final class ReportResource extends PublicationResource implements HasUriTemplate
{
    public function __construct(private readonly ReportReader $reports, private readonly ReadGrant $reads) {}

    public function uriTemplate(): UriTemplate
    {
        return new UriTemplate('journal://v1/reports/{id}');
    }

    public function shouldRegister(JobPermissionReader $permissions, ReadReportTool $reader): bool
    {
        return $permissions->allows($reader);
    }

    protected function read(Request $request): Response
    {
        $id = ToolArguments::read($this->name(), $request, ['id'])->recordReference('id');
        $this->reads->assertAllowed(new ReadRequest(ReportPages::TOOL, ResourceAreaType::JournalContent));

        return $this->markdown($this->reports->report($id, $this->bodyArguments(ReportPages::TOOL)));
    }
}
