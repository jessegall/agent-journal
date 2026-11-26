<?php

declare(strict_types=1);

namespace Domain\Rules\Mcp\Resources;

use App\Mcp\Resources\JournalResource;
use App\Mcp\Support\ToolArguments;
use Domain\Rules\Support\Mcp\RulesListResult;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\MimeType;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Attributes\Uri;

#[Name('rules')]
#[Uri('journal://v1/rules')]
#[MimeType('application/json')]
#[Description('The active rules, with the same pages as rules_list.')]
final class RulesResource extends JournalResource
{
    public function __construct(private readonly RulesListResult $rules) {}

    protected function read(Request $request): Response
    {
        $arguments = ToolArguments::query($this->name(), $request, ['page', 'continuation']);

        return Response::text(json_encode(
            $this->rules->read($arguments)->structuredContent(),
            JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE,
        ));
    }
}
