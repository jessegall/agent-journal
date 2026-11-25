<?php

declare(strict_types=1);

namespace Domain\Documents\Resolvers;

use App\Mcp\Contracts\Continuations;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\Continuation;
use Domain\Documents\Contracts\Attachments\AttachmentReader as AttachmentReaderContract;
use Domain\Documents\Models\TextUpload;
use Domain\Documents\Support\Mcp\PublicationChunks;

final readonly class AttachmentReader implements AttachmentReaderContract
{
    public const string TOOL = 'attachments_read';

    public function __construct(private Continuations $continuations, private PublicationChunks $chunks) {}

    public function attachment(string $id, string|null $continuation): ToolResult
    {
        $upload = TextUpload::findSealed($id);

        $position = $continuation === null
            ? new Continuation(self::TOOL, $id, [], 1)
            : $this->continuations->open($continuation, self::TOOL, $id);

        return $this->chunks->page($upload->attachmentText(), $position, 'attachment_id', ['attachment_id' => $id]);
    }
}
