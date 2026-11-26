<?php

declare(strict_types=1);

namespace App\Asks\Enums;

enum AskOriginType: string
{
    case Internal = 'internal';
    case Supervisor = 'supervisor';
}
