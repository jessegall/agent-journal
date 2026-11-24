<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Whether a run's result may answer the agent (Normal) or only proves a reader or contract and never gets a result
 * receipt.
 */
enum RunMode: string
{
    case Normal = 'normal';
    case Evidence = 'evidence';
}
