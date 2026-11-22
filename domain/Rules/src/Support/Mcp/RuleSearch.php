<?php

declare(strict_types=1);

namespace Domain\Rules\Support\Mcp;

use App\Mcp\Contracts\SearchContribution;
use App\Mcp\Data\SearchHit;
use App\Mcp\Data\SearchPage;
use App\Values\ReadRequest;
use Domain\Rules\Contracts\RuleResolver;
use Domain\Rules\Values\RuleFilters;
use Domain\Rules\Values\RuleView;

final readonly class RuleSearch implements SearchContribution
{
    public function __construct(private RuleResolver $rules) {}

    public function recordType(): string
    {
        return 'rules.rule';
    }

    public function readRequest(): ReadRequest
    {
        return new ReadRequest('rules_read');
    }

    public function search(string $query, int $page): SearchPage
    {
        $matches = $this->rules->list(new RuleFilters(search: $query, page: $page, perPage: self::PAGE_SIZE));

        if ($matches->page !== $page) {
            return new SearchPage([], false);
        }

        $hits = array_map(fn (RuleView $rule) => SearchHit::matching(
            $this->recordType(),
            $rule->id,
            "Rule {$rule->number}",
            $rule->text,
            $query,
        ), $matches->rules);

        return new SearchPage($hits, $page < $matches->lastPage);
    }
}
