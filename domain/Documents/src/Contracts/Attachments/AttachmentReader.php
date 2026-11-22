<?php

declare(strict_types=1);

namespace Domain\Documents\Contracts\Attachments;

use App\Mcp\Data\ToolResult;

interface AttachmentReader
{
    public function attachment(string $id, string|null $continuation): ToolResult;
}
