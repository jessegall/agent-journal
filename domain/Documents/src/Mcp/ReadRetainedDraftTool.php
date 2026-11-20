<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp;

use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\Continuation;
use App\Mcp\Support\Continuations;
use App\Mcp\Support\ToolArguments;
use Domain\Documents\Contracts\DraftReader;
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
        private readonly PublicationChunks $chunks,
    ) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'draft_id' => $schema->string()->max(26)->required(),
            'continuation' => $schema->string(),
        ];
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        $id = $arguments->ulid('draft_id');
        $draft = $this->drafts->draft($id);
        $cursor = $arguments->continuation();
        $read = $cursor === null
            ? new Continuation($this->name(), $id, [], 1)
            : $this->continuations->open($cursor, $this->name(), $id);

        return $this->chunks->page($draft->body, $read, 'draft_id', [
            'draft_id' => $id,
            'document_id' => $draft->documentId,
            'base_revision' => $draft->baseRevision,
            'reason' => mb_strcut($draft->reason, 0, 500),
        ]);
    }
}
