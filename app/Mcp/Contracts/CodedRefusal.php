<?php

declare(strict_types=1);

namespace App\Mcp\Contracts;

use App\Mcp\Enums\RefusalCode;

/**
 * A refusal an MCP caller is shown with its code; its exception message is the safe text it reads.
 */
interface CodedRefusal
{
    public function refusalCode(): RefusalCode;
}
