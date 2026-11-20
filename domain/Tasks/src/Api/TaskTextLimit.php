<?php

declare(strict_types=1);

namespace Domain\Tasks\Api;

enum TaskTextLimit: int
{
    case Title = 240;

    case Note = 8000;
}
