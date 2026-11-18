<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * Who asked for a launch: a main agent launched for itself, or an owner such as Helpers launching for a job it holds.
 */
enum LaunchOriginType: string
{
    case MainLaunch = 'main_launch';
    case OwnerRequest = 'owner_request';
}
