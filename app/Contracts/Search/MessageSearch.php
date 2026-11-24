<?php

declare(strict_types=1);

namespace App\Contracts\Search;

/**
 * The search over messages, which a domain declares as its searchable without naming Core's provider.
 */
interface MessageSearch extends SearchProvider {}
