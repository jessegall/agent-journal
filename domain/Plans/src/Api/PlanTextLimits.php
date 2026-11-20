<?php

declare(strict_types=1);

namespace Domain\Plans\Api;

final class PlanTextLimits
{
    public const int TITLE = 240;

    public const int BRIEF = 20000;

    public const int NOTE = 8000;
}
