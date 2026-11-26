<?php

declare(strict_types=1);

namespace App\Sessions\Enums;

/**
 * Who asked for a start: a main agent started for itself, or an owner such as Helpers starting for a job it holds.
 */
enum StartOriginType: string
{
    case MainStart = 'main_start';
    case OwnerRequest = 'owner_request';
}
