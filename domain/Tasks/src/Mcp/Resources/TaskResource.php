<?php

declare(strict_types=1);

namespace Domain\Tasks\Mcp\Resources;

use App\Contracts\Authorization\ReadGrant;
use App\Mcp\Resources\JournalResource;
use App\Mcp\Support\ToolArguments;
use Domain\Tasks\Support\Mcp\TaskReadResult;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\MimeType;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Contracts\HasUriTemplate;
use Laravel\Mcp\Support\UriTemplate;

#[Name('task')]
#[MimeType('application/json')]
#[Description('A task summary or context, with the same fields and continuation as tasks_read.')]
final class TaskResource extends JournalResource implements HasUriTemplate
{
    private const string TEMPLATE = 'journal://v1/tasks/{id}';

    public function __construct(private readonly TaskReadResult $tasks, private readonly ReadGrant $reads) {}

    public function uriTemplate(): UriTemplate
    {
        return new UriTemplate(self::TEMPLATE);
    }

    protected function read(Request $request): Response
    {
        $taskId = ToolArguments::uriId($request);
        $view = ToolArguments::query($this->name(), $request, [
            'view',
            'continuation',
        ]);
        $this->reads->assertAllowed(TaskReadResult::requestFor($taskId));

        return Response::text(json_encode(
            $this->tasks->read($taskId, $view)->structuredContent(),
            JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE,
        ));
    }
}
