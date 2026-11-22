<?php

declare(strict_types=1);

return [

    /*
    | Whether the search tool runs over the sources the domains declare, in the integration build, instead of the
    | six registered search areas the release serves. The cutover removes this switch with the old path.
    */

    'declared' => (bool) env('SEARCH_DECLARED_SOURCES', false),

];
