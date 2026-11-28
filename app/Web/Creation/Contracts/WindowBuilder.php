<?php

declare(strict_types=1);

namespace App\Web\Creation\Contracts;

use Illuminate\Http\Request;
use Spatie\LaravelData\Data;

interface WindowBuilder
{
    /** Builds the window for an isolated visit. */
    public function build(Request $visit): Data;
}
