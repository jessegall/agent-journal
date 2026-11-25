<?php

declare(strict_types=1);

namespace Domain\Plans\Mcp\Resources;

use App\Contracts\Authorization\ReadGrant;
use App\Mcp\Resources\JournalResource;
use App\Mcp\Support\ToolArguments;
use App\Values\ReadRequest;
use Domain\Plans\Support\Mcp\PlanReadResult;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\MimeType;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Contracts\HasUriTemplate;
use Laravel\Mcp\Support\UriTemplate;

#[Name('plan')]
#[MimeType('application/json')]
#[Description('Plan details with the same fields and continuation as plans_read.')]
final class PlanResource extends JournalResource implements HasUriTemplate
{
    private const string TEMPLATE = 'journal://v1/plans/{id}';

    public function __construct(private readonly PlanReadResult $plans, private readonly ReadGrant $reads) {}

    public function uriTemplate(): UriTemplate
    {
        return new UriTemplate(self::TEMPLATE);
    }

    protected function read(Request $request): Response
    {
        $planId = ToolArguments::uriId($request);

        $view = ToolArguments::query($this->name(), $request, [
            'view',
            'continuation',
        ]);

        $this->reads->assertAllowed(ReadRequest::forRecord(PlanReadResult::TOOL, PlanReadResult::ID_ARGUMENT, $planId));

        return Response::text(json_encode(
            $this->plans->read($planId, $view)->structuredContent(),
            JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE,
        ));
    }
}
