<?php

declare(strict_types=1);

namespace App\Mcp\Resources;

use App\Mcp\Support\OverviewResolver;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\MimeType;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Attributes\Uri;

/**
 * journal://v1/overview: the same overview as overview_read, as JSON.
 */
#[Name('overview')]
#[Description('Your agent and session, the state your stack answers from, and counts of the work you hold.')]
#[Uri('journal://v1/overview')]
#[MimeType('application/json')]
final class OverviewResource extends JournalResource
{
    public function __construct(private readonly OverviewResolver $overview) {}

    protected function read(Request $request): Response
    {
        return Response::text(json_encode($this->overview->read()->structuredContent(), JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
    }
}
