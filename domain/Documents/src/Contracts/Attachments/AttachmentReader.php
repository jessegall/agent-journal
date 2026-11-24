<?php

declare(strict_types=1);

namespace Domain\Documents\Contracts\Attachments;

use App\Mcp\Data\ToolResult;

interface AttachmentReader
{
    /**
     * The attachment's text as a tool answer, read on from the continuation when one is given.
     */
    public function attachment(string $id, string|null $continuation): ToolResult;
}
