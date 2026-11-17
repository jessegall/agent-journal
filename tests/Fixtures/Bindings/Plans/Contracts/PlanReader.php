<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bindings\Plans\Contracts;

use Illuminate\Container\Attributes\Bind;
use Tests\Fixtures\Bindings\Plans\PlanNotes;

#[Bind(PlanNotes::class)]
interface PlanReader {}
