<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp\Tools;

use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Contracts\Continuations;
use App\Mcp\Contracts\TextFields;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\Continuation;
use App\Mcp\Support\ToolArguments;
use Domain\Documents\Contracts\Drafts\DraftReader;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[IsReadOnly]
#[Name('docs_drafts_read')]
#[Description('Read a private saved draft and why it was kept.')]
#[VisibleToProfiles(DiscoveryProfile::MainAgent, DiscoveryProfile::WritingHelper)]
final class ReadRetainedDraftTool extends PublicationReadTool
{
    public function __construct(
        private readonly DraftReader $drafts,
        private readonly Continuations $continuations,
        private readonly TextFields $fields,
    ) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'draft_id' => $this->recordIdArgument($schema),
            'continuation' => $schema->string(),
        ];
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        $id = $arguments->ulid('draft_id');
        $draft = $this->drafts->draft($id);

        $text = [
            'body' => $draft->body,
            'reason' => $draft->reason,
        ];

        $cursor = $arguments->continuation();

        $position = $cursor === null
            ? $this->fields->start(new Continuation($this->name(), $id, [], 1), $text)
            : $this->continuations->open($cursor, $this->name(), $id);

        $summary = [
            'draft_id' => $id,
            'document_id' => $draft->documentId,
            'base_revision' => $draft->baseRevision,
        ];

        return $this->fields->page($summary, $text, $position, 'draft_id');
    }
}
