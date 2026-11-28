<?php

declare(strict_types=1);

namespace App\Web\Creation\Contracts;

use Illuminate\Http\Request;
use Spatie\LaravelData\Data;

interface PageBuilder
{
    /** Builds the page for an isolated visit. */
    public function build(Request $visit): Data;
}
