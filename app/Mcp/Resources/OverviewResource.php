<?php

declare(strict_types=1);

namespace App\Mcp\Resources;

use App\Access\Contracts\ReadGrant;
use App\Mcp\Support\OverviewResolver;
use App\Values\ReadRequest;
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
#[Uri('journal://v1/overview')]
#[MimeType('application/json')]
#[Description('Your agent and session, the state your stack answers from, and counts of the work you hold.')]
final class OverviewResource extends JournalResource
{
    public function __construct(private readonly OverviewResolver $overview, private readonly ReadGrant $reads) {}

    protected function read(Request $request): Response
    {
        $this->reads->assertAllowed(new ReadRequest('overview_read'));

        return Response::text(
            json_encode(
                $this->overview->read()->structuredContent(),
                JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE,
            ),
        );
    }
}
