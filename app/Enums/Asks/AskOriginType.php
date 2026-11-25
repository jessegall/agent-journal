<?php

declare(strict_types=1);

namespace App\Enums\Asks;

enum AskOriginType: string
{
    case Internal = 'internal';
    case Supervisor = 'supervisor';
}
