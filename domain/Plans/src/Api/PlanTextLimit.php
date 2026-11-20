<?php

declare(strict_types=1);

namespace Domain\Plans\Api;

enum PlanTextLimit: int
{
    case Title = 240;

    case Brief = 20000;

    case Note = 8000;
}
