<?php

declare(strict_types=1);

namespace App\Mcp\Resources;

use App\Access\Contracts\ReadGrant;
use App\Mcp\Support\OperationsResolver;
use App\Values\ReadRequest;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\MimeType;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Contracts\HasUriTemplate;
use Laravel\Mcp\Support\UriTemplate;

/**
 * journal://v1/operations/{request_key}: the same reading of a write as operations_read, with ?continuation= for the
 * next outcomes.
 */
#[Name('operation')]
#[MimeType('application/json')]
#[Description('What became of your write sent with this request_key, and its outcomes; add ?continuation= for the next ones.')]
final class OperationResource extends JournalResource implements HasUriTemplate
{
    private const string TEMPLATE = 'journal://v1/operations/{request_key}';

    public function __construct(private readonly OperationsResolver $operations, private readonly ReadGrant $reads) {}

    public function uriTemplate(): UriTemplate
    {
        return new UriTemplate(self::TEMPLATE);
    }

    protected function read(Request $request): Response
    {
        $uri = (string) $request->uri();
        parse_str((string) parse_url($uri, PHP_URL_QUERY), $query);
        $requestKey = basename((string) parse_url($uri, PHP_URL_PATH));
        $continuation = is_string($query['continuation'] ?? null) ? $query['continuation'] : null;
        $this->reads->assertAllowed(new ReadRequest('operations_read', ['request_key' => $requestKey]));

        return Response::text(
            json_encode(
                $this->operations->read($requestKey, $continuation)->structuredContent(),
                JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE,
            ),
        );
    }
}
