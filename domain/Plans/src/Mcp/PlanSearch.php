<?php

declare(strict_types=1);

namespace Domain\Plans\Mcp;

use App\Agents\Values\ReadRequest;
use App\Mcp\Contracts\SearchContribution;
use App\Mcp\Data\SearchHit;
use App\Mcp\Data\SearchPage;
use Domain\Plans\Api\PlanCard;
use Domain\Plans\Api\PlanFilters;
use Domain\Plans\Contracts\PlanResolver;

final readonly class PlanSearch implements SearchContribution
{
    public function __construct(private PlanResolver $plans) {}

    public function recordType(): string
    {
        return 'plans.plan';
    }

    public function readRequest(): ReadRequest
    {
        return new ReadRequest('plans_read');
    }

    public function search(string $query, int $page): SearchPage
    {
        $matches = $this->plans->list(new PlanFilters(search: $query, page: $page, perPage: self::PAGE_SIZE));
        if ($matches->page !== $page) {
            return new SearchPage([], false);
        }

        $hits = array_map(fn (PlanCard $plan): SearchHit => SearchHit::matching(
            $this->recordType(), $plan->id, $plan->title, $plan->title, $query,
        ), $matches->cards);

        return new SearchPage($hits, $page < $matches->lastPage);
    }
}
