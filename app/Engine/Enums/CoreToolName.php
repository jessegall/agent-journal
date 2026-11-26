<?php

declare(strict_types=1);

namespace App\Engine\Enums;

/**
 * The names of Core's tools that a domain's texts name to an agent.
 */
enum CoreToolName: string
{
    case OutputsRead = 'outputs_read';
}
