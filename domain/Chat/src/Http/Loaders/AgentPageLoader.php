<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Loaders;

use Domain\Chat\Data\AgentPageCursorData;
use Domain\Chat\Data\AgentPageData;
use Domain\Chat\Support\AgentListing;

/**
 * The chat list's next page, read as the list scrolls to its end: the agents after the one the cursor names.
 */
final readonly class AgentPageLoader
{
    public function __construct(private AgentListing $listing) {}

    public function __invoke(AgentPageCursorData $input): AgentPageData
    {
        return $this->listing->pageAfter($input);
    }
}
