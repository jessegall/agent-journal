<?php

declare(strict_types=1);

namespace App\Bus\Enums;

/**
 * Where a module middleware runs: before the command's transaction opens, or inside it.
 */
enum MiddlewareStage: string
{
    case BeforeTransaction = 'before_transaction';
    case InsideTransaction = 'inside_transaction';
}
