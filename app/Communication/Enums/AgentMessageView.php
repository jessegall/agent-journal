<?php

declare(strict_types=1);

namespace App\Communication\Enums;

enum AgentMessageView: string
{
    case Summary = 'summary';
    case Context = 'context';
}
