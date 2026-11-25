<?php

declare(strict_types=1);

namespace App\Enums\Engine;

enum CommandAdmissionStage: string
{
    case BeforeMiddleware = 'before_middleware';
    case BeforeHandler = 'before_handler';
}
