<?php

declare(strict_types=1);

namespace Domain\Rules\Support\Mcp;

use App\Mcp\Contracts\NumberedPages;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ListedPage;
use App\Mcp\Support\ToolArguments;
use Domain\Rules\Contracts\RuleResolver;
use Domain\Rules\Enums\RuleState;
use Domain\Rules\Values\RuleFilters;

final readonly class RulesListResult
{
    public const string TOOL = 'rules_list';

    public function __construct(private RuleResolver $rules, private NumberedPages $pages) {}

    public function read(ToolArguments $arguments): ToolResult
    {
        return $this->pages->answer(
            self::TOOL,
            $arguments,
            fn (ToolArguments $initialArguments) => [
                'state' => $initialArguments->enumOr('state', RuleState::Active)->value,
                'page' => $initialArguments->positiveIntegerOr('page', 1),
            ],
            fn (ToolArguments $filters) => $this->page(new RuleFilters(
                page: $filters->positiveInteger('page'),
                state: $filters->enum('state', RuleState::class),
            )),
        );
    }

    private function page(RuleFilters $filters): ListedPage
    {
        $page = $this->rules->list($filters);
        $cards = [];

        foreach ($page->rules as $rule) {
            $cards[$rule->id] = [
                'rule_id' => $rule->id,
                'number' => $rule->number,
                'state' => $rule->state->value,
                'preview' => mb_strimwidth($rule->text, 0, 180, '…'),
            ];
        }

        return new ListedPage($cards, $page->page, RuleResolver::PER_PAGE, $page->total);
    }
}
