<?php

declare(strict_types=1);

namespace Domain\Documents\Resolvers;

use App\Mcp\Data\ToolResult;
use App\Mcp\Support\Continuation;
use App\Mcp\Contracts\Continuations;
use Domain\Documents\Contracts\AttachmentReader;
use Domain\Documents\Mcp\PublicationChunks;
use Domain\Documents\Models\TextUpload;

final readonly class AttachmentPages implements AttachmentReader
{
    public const string TOOL = 'attachments_read';

    public function __construct(private Continuations $continuations, private PublicationChunks $chunks) {}

    public function attachment(string $id, string|null $continuation): ToolResult
    {
        $upload = TextUpload::sealed($id);
        $read = $continuation === null
            ? new Continuation(self::TOOL, $id, [], 1)
            : $this->continuations->open($continuation, self::TOOL, $id);

        return $this->chunks->page($upload->attachmentText(), $read, 'attachment_id', ['attachment_id' => $id]);
    }
}
