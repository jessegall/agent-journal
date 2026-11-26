<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp\Resources;

use App\Access\Contracts\ReadGrant;
use App\CommandRules\Mcp\Contracts\JobPermissionReader;
use App\Values\ReadRequest;
use Domain\Documents\Contracts\Reports\ReportReader as ReportReaderContract;
use Domain\Documents\Mcp\Tools\ReadReportTool;
use Domain\Documents\Resolvers\ReportReader;
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
    public function __construct(private readonly ReportReaderContract $reports, private readonly ReadGrant $reads) {}

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
        $id = $this->pathArguments($request, ['id'])->recordReference('id');
        $this->reads->assertAllowed(new ReadRequest(ReportReader::TOOL));

        return $this->markdown(
            $this->reports->report($id, $this->bodyArguments($request, ReportReader::TOOL)),
            $request,
        );
    }
}
