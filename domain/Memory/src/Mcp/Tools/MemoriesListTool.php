<?php

declare(strict_types=1);

namespace Domain\Memory\Mcp\Tools;

use App\CommandRules\Mcp\Tools\JournalReadTool;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Contracts\NumberedPages;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ListedPage;
use App\Mcp\Support\ToolArguments;
use App\Values\ReadRequest;
use Domain\Memory\Contracts\MemoryResolver;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[IsReadOnly]
#[Name('memories_list')]
#[VisibleToProfiles(DiscoveryProfile::MainAgent, DiscoveryProfile::WritingHelper)]
#[Description('List your memories by weight, with text previews and revision numbers.')]
final class MemoriesListTool extends JournalReadTool
{
    public function __construct(private readonly MemoryResolver $memories, private readonly NumberedPages $pages) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'page' => $schema->integer()->min(1),
            'continuation' => $schema->string(),
        ];
    }

    public function readRequest(ToolArguments|null $arguments = null): ReadRequest
    {
        if ($arguments === null) {
            return ReadRequest::forDiscovery($this->name());
        }

        return new ReadRequest($this->name());
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        return $this->pages->answer(
            $this->name(),
            $arguments,
            fn (ToolArguments $initialArguments) => ['page' => $initialArguments->positiveIntegerOr('page', 1)],
            fn (ToolArguments $filters) => $this->page($filters->positiveInteger('page')),
        );
    }

    private function page(int $number): ListedPage
    {
        $page = $this->memories->own($number);
        $cards = [];

        foreach ($page->cards as $memory) {
            $cards[$memory->id] = [
                'memory_id' => $memory->id,
                'number' => $memory->number,
                'preview' => mb_strimwidth($memory->text, 0, 160, '…'),
                'weight' => $memory->weight,
                'revision' => $memory->revision,
            ];
        }

        return new ListedPage($cards, $page->page, $page->perPage, $page->total);
    }
}
