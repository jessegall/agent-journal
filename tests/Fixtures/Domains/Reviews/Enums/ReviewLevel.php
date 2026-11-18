<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Reviews\Enums;

enum ReviewLevel: int
{
    case FirstPass = 1;
    case SecondPass = 2;
}
