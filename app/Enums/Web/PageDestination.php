<?php

declare(strict_types=1);

namespace App\Enums\Web;

/**
 * Where a page opens: as a page of its own, or in the inspector beside the page that links to it.
 */
enum PageDestination: string
{
    case Page = 'page';
    case Inspector = 'inspector';
}
