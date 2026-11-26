<?php

declare(strict_types=1);

namespace App\Search\Enums;

/**
 * What a search request asks: fresh words, the next page of an earlier search, or a page of the sources.
 */
enum SearchRequestType: string
{
    case Fresh = 'fresh';
    case Continuation = 'continuation';
    case Discovery = 'discovery';
}
