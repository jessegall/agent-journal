<?php

declare(strict_types=1);

namespace App\Domain\Access\Contracts;

use App\Domain\Access\Api\Viewer;
use App\Domain\Access\ViewerRecords;
use Illuminate\Container\Attributes\Bind;

/**
 * The user signed in to this request's session, as a page may show them, or none for a guest such as the sign-in page.
 */
#[Bind(ViewerRecords::class)]
interface ViewerReader
{
    public function viewer(): Viewer|null;
}
