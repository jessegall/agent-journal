<?php

declare(strict_types=1);

namespace App\Contracts\Refusals;

use App\Enums\Engine\RefusalCode;

/**
 * A refusal an MCP caller is shown with its code; its exception message is the safe text it reads.
 */
interface CodedRefusal
{
    /**
     * The code a caller tells this refusal apart by.
     */
    public function refusalCode(): RefusalCode;
}
